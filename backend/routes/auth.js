const express = require("express");
const router = express.Router();
const { cat } = require("../src/module/auth.controller");
const addCategory = require("../controllers/category");
const getticketbyid = require("../controllers/ticketfind");

const updateTicketStatus = require('../controllers/updateticketstatus')
const getStatusCounts = require("../controllers/ticketstatus")
const allCategory = require("../controllers/category")
const subcategories = require("../controllers/category")
const empstatus=require("../controllers/tikcetstatusemp")
const createAllowance=require('../controllers/Allowance')
const getAllowancesByUser=require('../controllers/allowanceaccept')
const updateallowance=require('../controllers/updateallowance')
const gettpmallowance=require('../controllers/getallowancetpm');
const authMiddleware = require("../middlewares/authMiddleware");

router.post('/send',authMiddleware() ,cat)
router.post('/category', addCategory);


router.get('/tickets/:userId',authMiddleware(), getticketbyid);
router.get('/allCategory', allCategory)
router.get('/categories/:categoryId/subcategories', subcategories)
router.put('/status/:ticketCode', updateTicketStatus)
router.get('/status-counts', authMiddleware("SystemAdmin"),getStatusCounts)
router.get('/empstatus',authMiddleware(),empstatus)
router.post('/attach',authMiddleware(),createAllowance)
router.get('/allowance/:userId',authMiddleware(),getAllowancesByUser)
router.put('/update/:id',updateallowance)
router.get('/allowances/:email',authMiddleware(),gettpmallowance)
module.exports = router;


// const Allowance = require('../models/Allowance');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const express = require('express');
// const app = express();

// // Helper function for email validation
// const validateEmail = (email) => {
//   const emailDomain = "@antiersolutions.com";
//   const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}$/; // Updated regex for better validation

//   if (!regex.test(email)) {
//     return false;
//   }

//   if (!email.endsWith(emailDomain)) {
//     return false;
//   }

//   return true;
// };

// // Ensure the upload directory exists
// const uploadDir = path.join(__dirname, "../../uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // Define the upload middleware
// const upload = multer({ storage: storage }).single('file'); // Single file upload

// const allowance = async (req, res) => {
//   upload(req, res, async function (err) {
//       if (err instanceof multer.MulterError) {
//           console.error("Multer error:", err);
//           return res.status(500).json({ error: "Multer error: " + err.message });
//       } else if (err) {
//           console.error("General error:", err);
//           return res.status(500).json({ error: "File upload error: " + err.message });
//       }

//       try {
//           const { tpmMail } = req.body;

//           // Validate email
//           if (!validateEmail(tpmMail)) {
//               return res.status(400).json({ message: "Invalid Email ID" });
//           }

//           // Create entry object from request body
//           const entry = {
//               date: new Date(req.body['entries[0].date']),
//               category: req.body['entries[0].category'],
//               description: req.body['entries[0].description'],
//               amount: parseFloat(req.body['entries[0].amount']),
//               tpmMail: tpmMail,
//               fileInfo: req.file ? {
//                   filename: req.file.filename,
//                   url: `/uploads/${req.file.filename}`,
//                   size: req.file.size
//               } : null,
//               status: 'Pending' // Ensure status is set correctly
//           };

//           // Create a new allowance entry in the database
//           const newAllowance = await Allowance.create(entry);
//           console.log('New Allowance Created:', newAllowance);
//           res.status(201).json(newAllowance);
//       } catch (error) {
//           console.error("Error creating allowance:", error);
//           res.status(500).json({ error: "Internal server error: " + error.message });
//       }
//   });
// };

// module.exports = allowance;