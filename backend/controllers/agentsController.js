const User = require('../models/User');
const Issue = require('../models/Issue');

const getAgentsWithOpenTickets = async (req, res) => {
  try {
    const roles = ['IT', 'HR', 'Admin'];
    const users = await User.find({ role: { $in: roles } }) // Filter users by roles
      .populate({
        path: 'assignedTickets',
        match: { status: 'Open' } // Only include open tickets
      });

    // Format the result to include only required fields
    const result = users.map(user => {
      return {
        name: user.empname,
        role: user.role,
        empid: user.empid,
        assignedTickets: user.assignedTickets.map(ticket => ({
          ticketId: ticket._id,
          ticketCode: ticket.ticketCode,
          description: ticket.description,
          status: ticket.status,
          createdAt: ticket.createdAt,
        })),
      };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching agents with open tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAgentsWithOpenTickets };