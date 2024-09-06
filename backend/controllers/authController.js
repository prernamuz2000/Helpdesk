const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const nodemailer = require("nodemailer");
const {
  generateRandomPassword,
  decryptCryptoPassword,
} = require("../utils/utils");
require("dotenv").config();
const authMiddleware = require("../middlewares/authMiddleware");
const {TOKEN_EXPIRY }= require("../config/config");

console.log('token expiry',TOKEN_EXPIRY);


// Route for user signup
router.post("/signup", async (req, res) => {
  console.log("server is running");
  try {
    const { empname, password, empid, phoneNo, email, role } = req.body;

    // Validate that all required fields are present
    if (!empname || !password || !empid || !phoneNo || !email || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if a user with the same employee ID or email already exists
    const existingUserByEmpid = await User.findOne({ empid });
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmpid) {
      return res.status(400).json({ error: "Employee ID already exists" });
    }
    if (existingUserByEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the user's password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document using the User model
    const user = new User({
      empname,
      password: hashedPassword,
      empid,
      phoneNo,
      email,
      role,
    });
    await user.save();
    // Generate a JWT token for the newly created user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.log("error in sign up controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get a list of users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "empname empid phone email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Changed to use 'email'

  console.log("data in login controller", email, password);

  // Validate that both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    // Changed to use 'email'
    if (!user) {
      console.log(user);

      return res.status(401).json({ error: "Invalid email or password" });
    }
    console.log("user", user);
    //now decrypting the password from client side

    const decryptedPassword = decryptCryptoPassword(password);

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(decryptedPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    const expiry = TOKEN_EXPIRY[user.role] || TOKEN_EXPIRY.Default;

    console.log('expiry in', expiry);


    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      {
        id: user._id,
        empid: user.empid,
        role: user.role,
        empname: user.empname,
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        expiresIn: expiry,
        issuer: process.env.JWT_ISSUER,
        subject: user.id.toString(),
      }
    );
    res.status(200).json({
      userId: user._id,
      empid: user.empid,
      empname: user.empname,
      role: user.role,
      email: user.email,
      token,
    });
    console.log("res send");
  } catch (error) {
    console.error("Error in Login Controller", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for forgot password
router.post("/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      console.log("sending 404 email is required");
      return res.status(400).json({ error: "Email is required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "singharundeep522@gmail.com",
        pass: "pvhd tzqe srzj tybx",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Fetching user data
    const user = await User.findOne({ email });
    console.log("user", user);
    if (!user) {
      console.log("sending 400 user not found");
      return res.status(404).json({ error: "User not found" });
    }

    //generating new password
    const password = generateRandomPassword();

    // Generating new password

    const htmlContent = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px;">
    <div style="background-color: #008BC9; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0;">
      <!-- Company Logo -->
      <img src="https://www.antiersolutions.com/wp-content/uploads/2021/08/logo_new2x-min.png" alt="Company Logo" style="max-width: 150px; margin-top: 10px;">
      <h1>Welcome to Help Desk</h1>
    </div>
    <div style="padding: 20px; text-align: center;">
      <p>Dear ${user.empname},</p>
     
      <p>Your new password is:</p>
      <p style="font-size: 18px; font-weight: bold; color: #333;">${password}</p>
      <!-- Replace with actual generated password or use a placeholder -->
      <p>Please use this password to log in and reset your password immediately.</p>
    </div>
    <div style="text-align: center; padding: 10px; color: #888; font-size: 12px;">
      <p>If you did not request a password reset, please contact our support team immediately at <a href="mailto:support@helpdesk.com" style="color: #888;">support@helpdesk.com</a>.</p>
    </div>
  </div>
</body>
</html>
`;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset for Help Desk",
      text: `Your New password is: ${password}`,
      html: htmlContent,
    };

    // Use async/await to send email
    const info = await transporter.sendMail(mailOptions);

    // Check for success and handle errors
    console.log("Email sent: " + info.response);

    // Generating the hash for generated password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.log("Error in forgot-password controller", err);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Route for change password
//add authMiddleware too
//eg. ("/cangePassword",authMiddleware())
router.post("/changePassword", async (req, res) => {
  try {
    let { empid, currentPassword, newPassword } = req.body;
    console.log(empid, currentPassword, newPassword);

    if (!empid || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Find user by empid
    const user = await User.findOne({ empid });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //decrypting incoming passwords

    currentPassword = decryptCryptoPassword(currentPassword);
    newPassword = decryptCryptoPassword(newPassword);
    console.log("cp", currentPassword);
    console.log("np", newPassword);

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current Password Is Incorrect" });
    }
    //check if new password is not equal to previous one
    if (newPassword === currentPassword) {
      return res
        .status(400)
        .json({ error: "New Password is same as the old password" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    // Update user's password in the database
    user.password = hashedNewPassword;
    await user.save();
    console.log("password change succesfully");
    res.status(200).json({ message: "Password successfully changed" });
  } catch (err) {
    console.error("Error in change-password controller:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to fetch user by ObjectId
router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

   
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return the user's details
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/userName/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Return the user's details
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
