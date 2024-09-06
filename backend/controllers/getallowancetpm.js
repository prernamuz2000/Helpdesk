const Allowance = require("../models/Allowance");

const gettpmallowance = async (req, res) => {
    try {
        const email = req.params.email; // Access query parameter

        if (!email) {
            return res.status(400).json({ message: "TPM email is required" });
        }

        // Log the email to verify it's being received
        console.log("Received email:", email);

        // Fetch allowances based on the email
        const allowances = await Allowance.find({ tpmEmail: email });

        if (allowances.length === 0) {
            return res.status(404).json({ message: "No allowances found for the given email" });
        }

        res.status(200).json({ allowances });
    } catch (error) {
        console.error('Error fetching allowances:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = gettpmallowance;
