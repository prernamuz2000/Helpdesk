const nodemailer = require('nodemailer');
/**
 * Sends an email with optional CC addresses.
 * @param {string} recipient - Recipient's email address.
 * @param {string} subject - Subject of the email.
 * @param {string} message - Body of the email.
 * @param {Array<string>} [cc=[]] - Optional array of CC email addresses.
 */
const sendNotification = async (recipient, subject, message,cc=[],htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "singharundeep522@gmail.com",
      pass: "pvhd tzqe srzj tybx",
    },tls:{
      rejectUnauthorized:false
    }
  });
  
  
  const mailOptions = {
    from: 'support@helpdesk.com',
    to: recipient,
    cc:cc.join(','),
    subject: subject,
    text: message,
    html:htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipient}`);
  } catch (error) {
    console.error(`Error sending email to ${recipient}:`, error);
  }
};

module.exports = {
  sendNotification,
};
