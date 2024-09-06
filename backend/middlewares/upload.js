const multer = require('multer');
const path = require('path');

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp + original extension
  },
});

// Validate file types
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif"];

  // Check if the uploaded file's mimetype is in the validTypes array
  if (validTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type! Only PDF, JPEG, PNG, and GIF files are allowed.'), false); // Reject the file
  }
};

// Configure multer with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // Optional: 5MB file size limit
});

module.exports = upload;
