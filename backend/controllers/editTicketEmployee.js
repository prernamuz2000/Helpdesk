const Issue = require("../models/Issue");
const { printGreen, printRed } = require("../utils/chalkUtils");

const editTicketEmployee = async (req, res) => {
  try {
    const ticketCode = req.params.ticketCode;
    printGreen(`ticket code , ${ticketCode}`);
    if (!ticketCode) {
      printRed("Ticket code is required");
      return res.status(400).json({ message: "Ticket code is required" });
    }

    const ticket = await Issue.findOne({ ticketCode: ticketCode });

    if (!ticket) {
      printRed("Ticket not found");
      return res.status(404).json({ message: "Ticket not found" });
    }
    const file = req.file;

    let fileInfo = null;
    if (file) {
      fileInfo = {
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        size: file.size,
      };
    }

    const { description } = req.body;

    // Debugging logs
    console.log("description", description);
    console.log("Uploaded file info:", req.file);

    // Update ticket details
    ticket.description = description || ticket.description;
    ticket.file = fileInfo;

    // Handle file upload
    /*if (req.file) {
      ticket.file = req.file.path; // Save file path
    }*/

    await ticket.save();
    return res.status(200).json(ticket);
  } catch (error) {
    console.log("error in upload pic", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = editTicketEmployee;
