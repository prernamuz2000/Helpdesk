import CryptoJS from 'crypto-js';
const secretKey = 'your-secret-key';

/**
 * Encrypts a password using AES encryption.
 * @param {string} password - The password to encrypt.
 * @returns {string} - The encrypted password as a base64-encoded string.
 */
export const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
};

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password) {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
  return pattern.test(password);
}

