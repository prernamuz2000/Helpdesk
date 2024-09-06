const Issue = require("../models/Issue");

const showData = async (req, res) => {
  try {
    res.status(200).json({ data: "admin data" });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
    console.log("error in create ticket controller", error.message);
  }
};

const getAllTickets = async (req, res) => {
  try {
    const issues = await Issue.find({});
    if (issues.length === 0) {
      return res.status(404).json({ message: "No tickets available" });
    }
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  showData,
  getAllTickets,
};
