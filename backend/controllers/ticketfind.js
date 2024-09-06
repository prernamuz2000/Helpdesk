const User = require("../models/User");
const Issue = require("../models/Issue");

const getTicketById = async (req, res) => {
  try {
    const { userId } = req.params; 
    console.log('Fetching user with ID:', userId);
    // Fetch the user and populate their tickets
    const user = await User.findById(userId).populate('tickets');

    if (!user) {
      console.log('No user found with ID:', userId);
      return res.status(404).send({ message: 'User not found' });
    }

    // Fetch tickets where the user is the creator
    const createdTickets = await Issue.find({ createdBy: userId });

    console.log('User found:', user);
    console.log('Associated tickets:', user.tickets);
    console.log('Tickets created by the user:', createdTickets);

    // Combine the tickets associated with the user and the tickets they created
    const allTickets = [...user.tickets, ...createdTickets];

    return res.status(200).send(allTickets);
  } catch (error) {
    console.error('Error fetching tickets by user ID:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = getTicketById;
