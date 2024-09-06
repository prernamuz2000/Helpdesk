const mongoose = require('mongoose');
const User = require('../models/User'); // Ensure correct path to User model

const empstatus = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(`Received request for user ID: ${userId}`);
    
    

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    // Convert userId to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch the user and populate their tickets
    const user = await User.findById(userObjectId).populate('tickets');

    if (!user) {
      console.log('No user found with ID:', userObjectId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Define statuses
    const definedStatuses = ['Resolved', 'On Hold', 'Open', 'In Progress', 'Unassigned'];

    // Initialize counts with zero
    const counts = definedStatuses.reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    // Calculate status counts from user's tickets
    user.tickets.forEach(ticket => {
      const status = ticket.status;
      if (definedStatuses.includes(status)) {
        counts[status] = (counts[status] || 0) + 1;
      }
    });

    console.log('Calculated status counts:', counts);

    return res.json({ success: true, counts });
  } catch (error) {
    console.error('Error fetching status counts:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

module.exports = empstatus;
