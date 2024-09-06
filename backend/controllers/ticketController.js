const config = require('../config/config');
const adminEmails = config.adminEmails;
const User = require("../models/User"); // Adjust the path based on your project structure
const Issue = require("../models/Issue"); // Adjust the path based on your project structure
const { sendNotification } = require("../utils/notifications");
const { printYellow, printGreen } = require("../utils/chalkUtils");
const { formatDate } = require("../utils/utils");
const {editTicketUser} = require ("./editTicketUser");




const sendAcknowledgement = async (req, res) => {
  try {
    // Function to get department emails
    const adminEmail = "arundeepsingh522@gmail.com";

    console.log("Sending acknowledgment");
    const { ticketCode } = req.body; // Ensure the request body contains ticketCode

    // Fetch ticket details
    const ticket = await Issue.findOne({ ticketCode });
    if (!ticket) {
      console.error("Error in sendAcknowledgement: Ticket Not Found");

      return { error: "Error sending acknowledgment" };
    }

    //console.log("Ticket:", ticket);
    const {
      employeeName,
      category,
      subcategory,
      email,
      employeeId,
      description,
    } = ticket;

    // Define subjects and messages

    //Employee email is from ticket
    const employeeSubject = "Ticket Acknowledgment";
    const employeeMessage = `Dear ${employeeName},\n\nYour ticket has been successfully created. Our team will review it shortly.\n\nBest regards,\nHelp Desk Team`;

    const adminSubject = "New Ticket Alert";
    const adminMessage = `A new ticket has been created by ${employeeName} (ID: ${employeeId}) under the category ${category} and subcategory ${subcategory}.\n\nTicket Code: ${ticketCode}\n\nKindly review and take the necessary actions.`;

    const adminTemplate = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; }
    .header { background-color: #008bc9; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
    .header img { max-width: 150px; margin-top: 10px; }
    .content { padding: 20px; text-align: center; }
    .footer { text-align: center; padding: 10px; color: #888; font-size: 12px; }
    a { color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.antiersolutions.com/wp-content/uploads/2021/08/logo_new2x-min.png" alt="Company Logo">
      <h1>New Ticket Assigned</h1>
    </div>
    <div class="content">
      <p>Dear Admin,</p>
      <p>A new ticket has been assigned to you for review and further action.</p>
      <p><strong>Details:</strong></p>
      <p>Ticket Code: ${ticketCode}</p>
      <p>Category: ${category}</p>
      <p>Subcategory: ${subcategory}</p>
      <p>Description: ${description}</>
      <p>Raised By: ${employeeName} (ID: ${employeeId})</p>
      <p>Please review the ticket and assign it to the appropriate employee.</p>
      <p>Best regards,<br>Help Desk Team</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact our support team at <a href="mailto:support@helpdesk.com">support@helpdesk.com</a>.</p>
    </div>
  </div>
</body>
</html>
`;
    const employeeTemplate = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; }
      .header { background-color: #008bc9; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
      .header img { max-width: 150px; margin-top: 10px; }
      .content { padding: 20px; text-align: center; }
      .footer { text-align: center; padding: 10px; color: #888; font-size: 12px; }
      a { color: #888; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://www.antiersolutions.com/wp-content/uploads/2021/08/logo_new2x-min.png" alt="Company Logo">
        <h1>Ticket Created</h1>
      </div>
      <div class="content">
        <p>Dear ${employeeName},</p>
        <p>Your ticket has been successfully created.</p>
        <p><strong>Details:</strong></p>
        <p>Ticket Code: ${ticketCode}</p>
        <p>Category: ${category}</p>
        <p>Subcategory: ${subcategory}</p>
        <p>Description: ${description}</>
        <p>Raised By: ${employeeName} (ID: ${employeeId})</p>
        <p>We will notify you once the ticket is assigned and being worked on.</p>
        <p>Best regards,<br>Help Desk Team</p>
      </div>
      <div class="footer">
        <p>If you have any questions, please contact our support team at <a href="mailto:support@helpdesk.com">support@helpdesk.com</a>.</p>
      </div>
    </div>
  </body>
  </html>
`;

    // Send notifications

    //notify Employee

    if (email) {
      console.log("employee email:", email);
      await sendNotification(
        email,
        employeeSubject,
        employeeMessage,
        [],
        employeeTemplate
      );
    }

    // Notify admin
    if (adminEmail) {
      console.log("Admin email:", adminEmail);
      await sendNotification(
        adminEmail,
        adminSubject,
        adminMessage,
        [],
        adminTemplate
      );
    }

    // Update the issue with the assignedTo field
    const result = await Issue.findOneAndUpdate(
      { ticketCode }, // Find the document by ticketCode
      { $set: { assignedTo: { name: "SystemAdmin", email: "" } } }, // Set the assignedTo field
      { new: true, upsert: false } // Return the updated document, do not create a new document
    );

    if (result) {
      console.log("Ticket updated:", result);
    } else {
      console.log("No ticket found with the given ticketCode.");
    }

    //returning admin name with empty email and object id

    console.log("Acknowledgment emails sent successfully");
    return {
      message: "Acknowledgment emails sent successfully",
      data: { name: "Admin", email: "" },
    };

    //res.status(200).json({ message: "Acknowledgments sent successfully" });
  } catch (error) {
    console.error("Error in sendAcknowledgement:", error);
    return { error: "Error sending acknowledgment" };
    //res.status(500).json({ error: "Internal server error" });
  }
};

const sendAssignedAcknowledgement = async (
  ticketDetails,
  isReassign = false
) => {
  printYellow(
    `ticket inside sendAssignedAck. ${typeof ticketDetails} ${isReassign}`
  );
  const {
    employeeName,
    employeeId,
    category,
    subcategory,
    assignedTo,
    ticketCode,
    email,
    description,
    comments,
    staffComments,
  } = ticketDetails;
  printYellow(`comments ${comments}`);

  try {
    //templates

    //Employee email is from ticket
    const staffAssignmentTemplate = `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; }
    .header { background-color: #008bc9; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
    .header img { max-width: 150px; margin-top: 10px; }
    .content { padding: 20px; text-align: center; }
    .footer { text-align: center; padding: 10px; color: #888; font-size: 12px; }
    a { color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.antiersolutions.com/wp-content/uploads/2021/08/logo_new2x-min.png" alt="Company Logo">
      <h1>New Ticket Assigned</h1>
    </div>
    <div class="content">
      <p>Dear ${assignedTo.name},</p>
      <p>You have been assigned a new ticket.</p>
      <p><strong>Details:</strong></p>
      <p><strong>Ticket Code:</strong> ${ticketCode}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subcategory:</strong> ${subcategory}</p>
      <p><strong>Assigned By:</strong> ${employeeName} (ID: ${employeeId})</p>
      ${description ? `<p><strong>Description:</strong> ${description}</p>` : ""}
      ${comments.comment ? `<p><strong>Admin Comments:</strong> ${comments.comment}</p>` : ""}
      ${staffComments.comment ? `<p><strong>Staff Comments:</strong> ${staffComments.comment}</p>` : ""}
      <p>Please review and resolve the ticket as soon as possible.</p>
      <p>Best regards,<br>Help Desk Team</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact our support team at <a href="mailto:support@helpdesk.com">support@helpdesk.com</a>.</p>
    </div>
  </div>
</body>
</html>
`;
    const employeeAssignedTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: Arial, sans-serif; 
      background-color: #f4f4f4; 
      margin: 0; 
      padding: 0; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
      background-color: #fff; 
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); 
      border-radius: 8px; 
      text-align: center; 
    }
    .header { 
      background-color: #008bc9; 
      color: #fff; 
      padding: 10px; 
      text-align: center; 
      border-radius: 8px 8px 0 0; 
    }
    .header img { 
      max-width: 150px; 
      margin-top: 10px; 
    }
    .content { 
      padding: 20px; 
      text-align: center; 
    }
    .footer { 
      text-align: center; 
      padding: 10px; 
      color: #888; 
      font-size: 12px; 
    }
    a { 
      color: #888; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.antiersolutions.com/wp-content/uploads/2021/08/logo_new2x-min.png" alt="Company Logo">
      <h1>Ticket Assigned</h1>
    </div>
    <div class="content">
      <p>Dear ${employeeName},</p>
      ${
        isReassign
          ? `<p>Your ticket has been reassigned to our staff member.</p>`
          : "<p>Your ticket has been assigned to our staff member.</p>"
      }
      <p><strong>Ticket Details:</strong></p>
      <p><strong>Ticket Code:</strong> ${ticketCode}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Subcategory:</strong> ${subcategory}</p>
      <p><strong>Assigned To:</strong> ${assignedTo.name}</p>
      <p><strong>Staff Email:</strong> ${assignedTo.email}</p>
      ${comments.comment ? `<p><strong>Admin Comments:</strong> ${comments.comment}</p>` : ""}
      ${staffComments.comment ? `<p><strong>Staff Comments:</strong> ${staffComments.comment}</p>` : ""}
      <p>We will notify you once the ticket is resolved.</p>
      <p>Best regards,<br>Help Desk Team</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact our support team at <a href="mailto:support@helpdesk.com">support@helpdesk.com</a>.</p>
    </div>
  </div>
</body>
</html>
`;

    //sedning mails to staff and then employee
    // Notify assigned staff
    const staffAssignedSubject = "Issue Assigned to You";
    const staffAssignedMessage = `Dear ${assignedTo.name},\n\nYou have been assigned a new ticket.\n\nDetails:\n- Ticket Code: ${ticketCode}\n- Category: ${category}\n- Subcategory: ${subcategory}\n- Raised By: ${employeeName} (ID: ${employeeId})\n\nPlease review the ticket and take necessary action.\n\nBest regards,\nHelp Desk Team`;

    if (assignedTo.email) {
      console.log("staff email", assignedTo.email);

      //remove test mail and replace it with assignedTo,email when Hr,It etc staff added

      let testMail = "arundeepsingh522@gmail.com";
      if (assignedTo.name === "Kajal IT") {
        testMail = assignedTo.email;
      }

      await sendNotification(
        testMail,
        staffAssignedSubject,
        staffAssignedMessage,
        [],
        staffAssignmentTemplate
      );
    }

    const employeeAssignedSubject = `Ticket Assigned: [${ticketDetails.ticketCode}] - ${ticketDetails.category}/${ticketDetails.subcategory}`;
    const employeeAssignedMessage = `Dear ${ticketDetails.employeeName},\n\nYour ticket (Code: ${ticketDetails.ticketCode}) has been assigned to ${ticketDetails.assignedTo}. Our team is working on it and will keep you updated on the progress.\n\nBest regards,\nHelp Desk Team`;

    //Notify Employee for Ticket Assignment

    if (ticketDetails.email) {
      console.log("employee email:", email);
      await sendNotification(
        email,
        employeeAssignedSubject,
        employeeAssignedMessage,
        [],
        employeeAssignedTemplate
      );
    }

    return true;
  } catch (error) {
    console.error(
      "Error in sendAssignedAcknowledgement function",
      error.message
    );
    throw error;
  }
};
const sendCommentNotification = async (ticketDetails, comment) => {
  try {
    const { employeeName, ticketCode, category, subcategory, email } =
      ticketDetails;

    // Email subject
    const commentNotificationSubject = `Comment on Ticket: [${ticketCode}] - ${category}/${subcategory}`;

    // Email message
    const commentNotificationMessage = `Dear ${employeeName},\n\nA comment has been added to your ticket (Code: ${ticketCode}). Here is the comment:\n\n"${comment}"\n\nPlease check the ticket for more details.\n\nBest regards,\nHelp Desk Team`;

    // Email template
    const commentNotificationTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; }
        .header { background-color: #008bc9; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
        .header img { max-width: 150px; margin-top: 10px; }
        .content { padding: 20px; text-align: center; }
        .footer { text-align: center; padding: 10px; color: #888; font-size: 12px; }
        a { color: #888; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://www.antiersolutions.com/wp-content/uploads/2021/08/logo_new2x-min.png" alt="Company Logo">
          <h1>Comment on Ticket</h1>
        </div>
        <div class="content">
          <p>Dear ${employeeName},</p>
          <p>A comment has been added to your ticket (Code: ${ticketCode}).</p>
          <p><strong>Comment:</strong></p>
          <p>${comment}</p>
          <p>Please check the ticket for more details.</p>
          <p>Best regards,<br>Help Desk Team</p>
        </div>
        <div class="footer">
          <p>If you have any questions, please contact our support team at <a href="mailto:support@helpdesk.com">support@helpdesk.com</a>.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Notify employee for ticket comment
    if (email) {
      console.log("Sending email to employee:", email);
      await sendNotification(
        email,
        commentNotificationSubject,
        commentNotificationMessage,
        [],
        commentNotificationTemplate
      );
    }
  } catch (error) {
    console.error("Error in sendCommentNotification function:", error.message);
    throw error;
  }
};

const sendUpdateNotification = async (ticketDetails, editedBY = "") => {
  try {
    const {
      email,
      employeeName,
      ticketCode,
      status,
      category,
      subcategory,
      description,
      staffComments,
      comments,
    } = ticketDetails;

    printGreen(
      `ticket inside sendUpdateNotification: ${ticketDetails} editedBy: ${editedBY}`
    );

    // Define the email subject
    const subject = editedBY
      ? `Ticket ${ticketCode} Updated by ${editedBY}`
      : `Ticket ${ticketCode} Updated `;

    const message = `Dear ${employeeName},\n\nYour ticket (Code: ${ticketCode}) has been updated.\n\nPlease check the ticket for more details.\n\nBest regards,\nHelp Desk Team`;

    // Define the email body with the updated template
    const sendingTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 8px; }
    .header { background-color: #008bc9; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }
    .header img { max-width: 150px; margin-top: 10px; }
    .content { padding: 20px; text-align: center; } /* Center the content */
    .footer { text-align: center; padding: 10px; color: #888; font-size: 12px; }
    a { color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://www.antiersolutions.com/wp-content/uploads/2021/08/logo_new2x-min.png" alt="Company Logo">
      <h1>Ticket Update Notification</h1>
    </div>
    <div class="content">
      <p>Dear ${employeeName},</p>
      <p>Your ticket with the code <strong>${ticketCode}</strong> has been updated by ${editedBY}.</p>
      <p><strong>Update Details:</strong></p>
      ${status ? `<p><strong>Status:</strong> ${status}</p>` : ""}
      ${category ? `<p><strong>Category:</strong> ${category}</p>` : ""}
      ${subcategory ? `<p><strong>Subcategory:</strong> ${subcategory}</p>` : ""}
      ${description ? `<p><strong>Description:</strong> ${description}</p>` : ""}
      ${comments.comment ? `<p><strong>Admin Comment:</strong> ${comments.comment}</p>` : ""}
      ${staffComments.comment ? `<p><strong>Staff Comment:</strong> ${staffComments.comment}</p>` : ""}

      <p>We are working to resolve your ticket as soon as possible. We will notify you of any further updates.</p>
      <p>Best regards,<br>Help Desk Team</p>
    </div>
    <div class="footer">
      <p>If you have any questions, please contact our support team at <a href="mailto:support@helpdesk.com">support@helpdesk.com</a>.</p>
    </div>
  </div>
</body>
</html>
`;



    if (email) {
      console.log("Sending email to employee:", email);
      await sendNotification(email, subject, message, editedBY==="Staff"?adminEmails:[], sendingTemplate);
    }
  } catch (error) {
    console.error("error in sendUpdateNotification function", error);
    throw error;
  }
};

const getTicketsAssignedToStaff = async (req, res) => {
  try {
    const staffId = req.params.staffId;

    // Check if staffId is provided
    if (!staffId) {
      console.log("staff id require");
      return res.status(400).json({ message: "Staff ID is required" });
    }
    // Find all tickets where the assignedTo.employeeId matches the provided staffId
    const tickets = await Issue.find({ "assignedTo.employeeId": staffId });

    // Check if any tickets were found
    if (!tickets.length) {
      return res
        .status(404)
        .json({ message: "No tickets available for this staff member"});
    }

    // Return the found tickets
    console.log("assigned Tickets", tickets);

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets assigned to staff:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  sendAcknowledgement,
  sendAssignedAcknowledgement,
  sendCommentNotification,
  getTicketsAssignedToStaff,
  sendUpdateNotification,
};
