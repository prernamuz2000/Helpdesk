const Issue = require("../models/Issue");
const {
  printRed,
  printBlue,
  printGreen,
} = require("../utils/chalkUtils");

const editTicketUser = async (req, res) => {
  console.log(req.description);
  
  try {
    printBlue("Inside ticket edit user");
    const ticketCode = req.params.ticketCode;
    printGreen(`ticket code , ${ticketCode}`)
   
    
    if (!ticketCode) {
      printRed("Ticket code is required");
      return res.status(400).json({ message: "Ticket code is required" });
    }
    
    const ticket = await Issue.findOne({ ticketCode: ticketCode });
    
    if (!ticket) {
      printRed("Ticket not found");
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    
    
    const { description } = req.body;

    
    printRed(`description inside editTicket User, ${description}`);
    console.log(req.body);
    
    console.log(description);
    
    

    // Prepare data to be updated
    const updateData = {};

    // Update description if it has changed
    if (description && description !== ticket.description) {
      updateData.description = description;
    }

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      updateData.fileUploads = [
        ...(ticket.fileUploads || []),
        ...req.files.map(file => file.path),
      ];
    }

    printRed(`new updateData: ${JSON.stringify(updateData, null, 2)}`);

    // Check if there is any data to update
    if (Object.keys(updateData).length === 0) {
      printRed("No updates were made as the data is the same as before");
      return res.status(400).json({ message: "No changes detected" });
    }

    // Perform the update
    const updatedTicket = await Issue.findOneAndUpdate(
      { ticketCode: ticketCode },
      { $set: updateData },
      { new: true }
    );

    printGreen("Ticket successfully updated");

    if (!updatedTicket) {
      printRed("Ticket not found after update");
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json(updatedTicket);
  } catch (error) {
    printRed(`Error in updating ticket: ${error}`);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = editTicketUser;