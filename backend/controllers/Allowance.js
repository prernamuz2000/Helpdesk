const Allowance = require('../models/Allowance');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Ensure the upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Define the upload middleware
const upload = multer({ storage: storage }).single('file'); // Single file upload

const createAllowance = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(500).json({ error: "Multer error: " + err.message });
    } else if (err) {
      console.error("General error:", err);
      return res.status(500).json({ error: "File upload error: " + err.message });
    }

    try {
      const { tpmMail, createdby } = req.body; // Extract tpmMail and createdby from the request body

      

      // Create entry object from request body
      const entry = {
        date: new Date(req.body['entries[0].date']), // Ensure this matches your expected format
        category: req.body['entries[0].category'],
        description: req.body['entries[0].description'],
        amount: parseFloat(req.body['entries[0].amount']),
        tpmEmail: tpmMail,
        createdby: createdby, // Add the createdby field

        fileInfo: req.file ? {
          filename: req.file.filename,
          url: `/uploads/${req.file.filename}`,
          size: req.file.size
        } : null,

        status: 'Pending',
      };

      // Create a new allowance entry in the database
      const newAllowance = await Allowance.create(entry);
      console.log('New Allowance Created:', newAllowance);
      res.status(201).json(newAllowance);
    } catch (error) {
      console.error("Error creating allowance:", error);
      res.status(500).json({ error: "Internal server error: " + error.message });
    }
  });
};

module.exports = createAllowance;
