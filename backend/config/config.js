require("dotenv").config();
const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];

// Define token expiration times for different roles
const TOKEN_EXPIRY = {
  Employee: "12h",
  Admin: "12h", // Admin tokens expire in 24 hours
  SystemAdmin: "24h", // System Admin tokens expire in 24 hours
  IT: "12h", // IT Staff tokens expire in 12 hours
  HR: "12h", // HR Staff tokens expire in 12 hours
  TPM: "12h",// TPM tokens expire in 12 hours
  Default: "1h", // Default token expiration for other roles
};

module.exports = {TOKEN_EXPIRY,adminEmails};