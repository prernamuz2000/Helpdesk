const Issue = require("../models/Issue");
const User = require("../models/User");
const { printRed, printMagenta } = require("../utils/chalkUtils");
const {
  sendAssignedAcknowledgement,
  sendCommentNotification,
  sendUpdateNotification,
} = require("./ticketController");

const edittickets = async (req, res) => {
  try {
    const ticketCode = req.params.ticketCode;
    if (!ticketCode) {
      return res.status(400).json({ message: "Ticket code is required" });
    }

    // Find the ticket by ticketCode
    const ticket = await Issue.findOne({ ticketCode: ticketCode });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Destructure form data from req.body
    const { category, subcategory, status, comments } = req.body;

    printRed(
      `data inside ticketEditAdmin ${category} ${subcategory} ${status} ${comments}`
    );

    printRed(`fetched ticket inside ticketEditAdmin ${ticket}`);

    let assignedTo = req.body.assignedTo;
    printRed(`data inside ticketEditAdmin ${assignedTo.email}`);

    // Find the staff member by email to get their ID
    let staff = null;
    if (assignedTo && assignedTo.email) {
      staff = await User.findOne({ email: assignedTo.email });
      if (staff) {
        assignedTo = {
          ...assignedTo, // Keep existing assignedTo data
          employeeId: staff._id, // Add the staff ID
        };
      }
    }

    // Data to be updated
    const updateData = {
      category,
      subcategory,
      status,
      assignedTo,
    };

    // Handling comments
    if (comments) {
      if (ticket.comments.comment !== comments) {
        ticket.comments = {
          comment: comments,
          date: new Date(), // Automatically set the comment date
        };
        printRed(`inside comments : ${ticket.comments}`);
      }
    }

    // Update the ticket with the new data
    const updatedTicket = await Issue.findOneAndUpdate(
      { ticketCode: ticketCode },
      { $set: { ...updateData, comments: ticket.comments } }, // Use $set to only update provided fields
      { new: true } // Return the updated document
    );

    printMagenta("Updated ticket:", updatedTicket);

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket?.assignedTo?.email === assignedTo?.email) {
      printRed(`Ticket is not assign to anyone`);
      printRed(`sending update notification`);

      // Send comment notification to employee
      await sendUpdateNotification(updatedTicket, "Admin");
    } else {
      printRed(`Ticket is assign to ${ticket.assignedTo.email}`);
      const staff = await User.findOne({ email: assignedTo.email });

      // Uncomment after HR, IT staff successfully added
      /*
      if (!staff) {
        return res.status(404).json({ message: "Staff Not found" });
      }
      */

      if (staff) {
        console.log("Staff found:", staff);

        if (!staff.assignedTickets) {
          staff.assignedTickets = [];
        }

        staff.assignedTickets.push(updatedTicket._id);

        console.log("After push:", staff);

        await staff.save();

        // Send acknowledgment to assigned staff
        await sendAssignedAcknowledgement(updatedTicket);
      }
    }

    return res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error in updating ticket controller:", error);
    return res.status(500).json({ message: error.message });
  }
};
module.exports = edittickets;
