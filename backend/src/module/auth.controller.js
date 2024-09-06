const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Issue = require("../../models/Issue");
const { sendAcknowledgement } = require("../../controllers/ticketController");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  },
});

const upload = multer({ storage: storage });

const validateEmail = (email) => {
  const emailDomain = "@antiersolutions.com";
  const regex = /^[A-Za-z0-9][^\s@]*@[^\s@]+\.[^\s@]+$/;

  if (!regex.test(email)) {
    return false;
  }

  /*
  if (!email.endsWith(emailDomain)) {
    return false;
  }*/

  return true;
};

const cat = (req, res) => {
  upload.single("file")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.error("General error:", err);
      return res.status(500).json({ error: "File upload error" });
    }

    try {
      console.log("Received request body:", req.body);

      const {
        employeeName,
        employeeId,
        email,
        floor,
        description,
        categoryId,
        subcategoryId,
        createdby,
      } = req.body;
      const file = req.file;

      if (
        !employeeName ||
        !employeeId ||
        !email ||
        !floor ||
        !description ||
        !categoryId ||
        !subcategoryId ||
        !createdby
      ) {
        console.log("Missing required fields:", req.body);
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid Email ID" });
      }

      let fileInfo = null;
      if (file) {
        fileInfo = {
          filename: file.filename,
          url: `/uploads/${file.filename}`,
          size: file.size,
        };
      }
      const newIssue = await Issue.createWithTicket({
        employeeName,
        employeeId,
        email,
        floor,
        description,
        category: categoryId,
        subcategory: subcategoryId,
        file: fileInfo,
        createdby,
      });
      console.log("ticket created data", newIssue);
      const ackResponse = await sendAcknowledgement({
        body: { ticketCode: newIssue.ticketCode },
      });
      console.log("ackResponse", ackResponse);

      if (ackResponse.message) {
        const data = ackResponse.data;

        console.log("inside ackResponse.message");
        res.status(201).json({
          message: "Ticket created and acknowledgment emails sent successfully",
          issues: {
            ...newIssue._doc,
            assignedTo: data,
          },
        });
      } else {
        console.log("inside ackResponse.error");
        res.status(500).json({ error: "Failed to send acknowledgement" });
      }
    } catch (error) {
      console.error("Error creating issue:", error);
      if (error.name === "ValidationError") {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });
};

module.exports = { cat };
