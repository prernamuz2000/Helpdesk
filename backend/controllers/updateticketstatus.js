const Issue=require('../models/Issue')


const updateTicketStatus = async (req, res) => {
    const ticketCode = req.params.ticketCode;
    let { status } = req.body;    
    // if (status) {
    //   status = status.trim().toLowerCase(); 
    //   status = status.charAt(0).toUpperCase() + status.slice(1);  
  
    // // Debugging: Log the normalized status
    // console.log('Normalized status:', status);
  
    const validStatuses = ['Open', 'In Progress', 'On Hold', 'Resolved'];
  
    // Validate status input
    if (!validStatuses.includes(status)) {
      console.log('Invalid status provided:', status); // Debug
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
  
    try {
      // Find the ticket by its ticketCode
      const ticket = await Issue.findOne({ ticketCode });
      if (!ticket) {
        console.log(`Ticket with code ${ticketCode} not found.`); // Debug
        return res.status(404).json({ success: false, message: 'Ticket not found' });
      }
  
      const oldStatus = ticket.status;
  
      console.log('Old status of the ticket:', oldStatus); // Debug
  
      // Check if the status has changed
      if (oldStatus !== status) {
        // Update the ticket status
        ticket.status = status;
        const updatedTicket = await ticket.save();
  
        console.log('Updated ticket:', updatedTicket); // Debug
        // Send success response
        res.json({ success: true, ticket: updatedTicket});
      } else {
        // Status has not changed
        console.log(`No status change for ticket code ${ticketCode}.`);
        res.json({
          success: true,
          message: 'Status is already set to the requested value',
        
        });
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  module.exports=updateTicketStatus
        