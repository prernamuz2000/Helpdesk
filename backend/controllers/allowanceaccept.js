const Allowance = require('../models/Allowance');

const getAllowancesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("UserId from request params:", userId);

        // Fetch allowances based on the userId, regardless of status
        const allowances = await Allowance.find({ createdby: userId });
        console.log("Allowances:", allowances);

        if (!allowances || allowances.length === 0) {
            return res.status(404).json({ message: "No allowances found" });
        }

        // Return the allowances
        res.status(200).json(allowances);
    } catch (err) {
        console.error("Error fetching allowances:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = getAllowancesByUser;
