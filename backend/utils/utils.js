const CryptoJS = require('crypto-js')
const secretKey = 'your-secret-key';
const chalk = require('chalk');
/**
 * Decrypts a password using AES encryption.
 * @param {string} encryptedPassword - The base64-encoded encrypted password.
 * @returns {string} - The decrypted password.
 */
const decryptCryptoPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
const generateRandomPassword = () => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const specialChars = "@#$%&?";

  // Ensure the first character is a lowercase letter
  let password = lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  // Ensure the second character is an uppercase letter
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  // Ensure the third character is a digit
  password += digits.charAt(Math.floor(Math.random() * digits.length));
  // Ensure the fourth character is a special character
  password += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  // Generate the remaining characters randomly
  for (let i = 4; i < 8; i++) {
    const randomCharset = lowercase + uppercase + digits + specialChars;
    password += randomCharset.charAt(
      Math.floor(Math.random() * randomCharset.length)
    );
  }

  return password;
};

const formatDate = (dateString) => {
  const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
  return new Date(dateString).toLocaleString('en-US', options);
};

module.exports = {
  generateRandomPassword,
  decryptCryptoPassword,
  formatDate
};
