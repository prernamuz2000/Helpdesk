const Issue = require("../models/Issue");

const getStatusCounts = async (req, res) => {
    try {
      
      // Define the statuses you want to track
      const definedStatuses = ['Resolved', 'Open','In Progress', 'Unassigned','On Hold' ];
      
      // Fetch the latest counts from the database
      const statusCounts = await Issue.aggregate([
        { $match: { status: { $ne: null } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);
  
      // Map the result to include only defined statuses
      const counts = statusCounts.reduce((acc, { _id, count }) => {
        if (definedStatuses.includes(_id)) {
          acc[_id] = count;
        }
        return acc;
      }, definedStatuses.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {}));
  
      console.log('Status counts:', counts); // Debugging output
      return res.json({ success: true, counts }); // Ensure the response structure is correct
    } catch (error) {
      console.error('Error fetching status counts:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  
  module.exports = getStatusCounts;
  