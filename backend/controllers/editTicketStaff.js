const Issue = require("../models/Issue");
const User = require("../models/User");
const {
  printRed,
  printBlue,
  printGreen,
  printCyan,
  printWhite,
  printMagenta,
  printYellow,
} = require("../utils/chalkUtils");
const {
  sendAssignedAcknowledgement,
  sendCommentNotification,
  sendUpdateNotification,
} = require("./ticketController");

const editTicketStaff = async (req, res) => {
  try {
    printBlue("Inside ticket edit staff");
    const ticketCode = req.params.ticketCode;
    printBlue(`Received ticketCode: ${ticketCode}`);
    if (!ticketCode) {
      printRed("Ticket code is required");
      return res.status(400).json({ message: "Ticket code is required" });
    }
    const ticket = await Issue.findOne({ ticketCode: ticketCode });

    if (!ticket) {
      printRed("Ticket not found");
      return res.status(404).json({ message: "Ticket not found" });
    }
    printBlue(`Fetched ticket: ${JSON.stringify(ticket, null, 2)}`);
    let { status: newStatus, comments: newStaffComments } = req.body;

    printRed(`new status: ${newStatus} newStaffComments: ${newStaffComments}`);

    // Data to be updated
    const updateData = {
      status: newStatus || ticket.status,
      staffComments: {
        comment: newStaffComments,
        date: new Date(),
      },
    };

    printRed(`new updateData ${updateData}`);
    console.log("update data afte adding employee id", updateData);
    console.log("new update data", updateData);

    // Staff-specific updates
    /*if (newStaffComments && newStaffComments !== ticket.staffComments) {
      updateData.staffComments = newStaffComments;
    }*/

    // Perform the update
    const updatedTicket = await Issue.findOneAndUpdate(
      { ticketCode: ticketCode },
      { $set: updateData },
      { new: true }
    );

   
    printRed(`updated ticket: ${updatedTicket}`);

    if (!updatedTicket) {
      printRed("Ticket not found after update");
      return res.status(404).json({ message: "Ticket not found" });
    }

    await sendUpdateNotification(updatedTicket, "Staff");

    return res.status(200).json(updatedTicket);
  } catch (error) {
    printRed(`Error in updating ticket: ${error}`);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = editTicketStaff;
