// departmentEmails.js
const mongoose = require("mongoose");

// Define the schema for department emails
const departmentEmailsSchema = new mongoose.Schema({
  department: {
    type: String,
    enum: ["HR", "Admin", "IT"],
    required: true,
  },
  headEmails: {
    type: [String], // Array of strings to hold multiple head emails
    required: true,
  },
  employeeEmails: {
    type: [String], // Array of strings to hold multiple employee emails
    required: true,
  },
});

// Create the model based on the schema
const DepartmentEmails = mongoose.model(
  "departmentEmails",
  departmentEmailsSchema
);

module.exports = DepartmentEmails;
