const Allowance = require('../models/Allowance');

const updateAllowance = async (req, res) => {
    try {
        const allowanceId = req.params.id; // Use route parameter for allowance ID
        const { decision } = req.body; // Destructure decision from request body

        // Define valid decisions
        const validDecisions = ["Accepted", "Rejected"];

        // Check if the decision is valid
        if (!validDecisions.includes(decision)) {
            return res.status(400).json({ message: "Invalid decision" });
        }

        // Update the allowance in the database
        const updatedAllowance = await Allowance.findByIdAndUpdate(
            allowanceId,
            { $set: { status: decision } },
            { new: true } // Return the updated document
        );

        // Check if the allowance was found and updated
        if (!updatedAllowance) {
            return res.status(404).json({ message: "Allowance not found" });
        }

        // Send success response
        res.status(200).json({ message: "Allowance updated successfully", data: updatedAllowance });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: error.message });
    }
};

module.exports = updateAllowance;
