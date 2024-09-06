const express = require("express");
const { fetchEmails } = require("../controllers/emailController");

const router = express.Router();

// Route to fetch emails by category and subcategory
router.get("/emails", fetchEmails);
module.exports = router;
