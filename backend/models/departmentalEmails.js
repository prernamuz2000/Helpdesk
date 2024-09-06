const mongoose = require("mongoose");

const departmentEmailSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  headEmails: [
    {
      name: String,
      email: String,
    },
  ],
  subcategories: [
    {
      name: {
        type: String,
        required: true,
      },
      staffEmails: [
        {
          name: String,
          email: String,
        },
      ],
    },
  ],
});

const DepartmentEmails = mongoose.model("DepartmentEmails", departmentEmailSchema);

module.exports = DepartmentEmails;
