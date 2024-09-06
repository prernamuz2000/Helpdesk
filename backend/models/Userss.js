const mongoose=require("mongoose")
const bcrypt = require('bcrypt');

const usersSchema = new mongoose.Schema({
  empname: {
    type: String,
    required: true,
  },
  empid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Employee','SystemAdmin','Admin','IT','HR','TPM'],
    required: true,
  },
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
    },
  ],
  assignedTickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Issue"
    }
  ],
  allowances: [
    { 
      type: mongoose.Schema.Types.ObjectId,
       ref: 'Allowance'
       }],
  assignedAllowance: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Allowance"
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Userss", usersSchema);
