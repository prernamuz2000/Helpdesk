const mongoose = require('mongoose');
const User = require('./User'); // Correct path to your User model
const Schema = mongoose.Schema;
const allowanceSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  allowanceticket: {
    type: String,
    required: true,
  },
  fileInfo: {
    filename: { type: String },
    url: { type: String },
    size: { type: Number },
  },
  tpmEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});


allowanceSchema.statics.generateAllowanceTicket = async function () {
  try {
    const lastAllowance = await this.findOne({})
      .sort({ createdAt: -1 })
      .select('allowanceticket')
      .lean();

    let nextTicketNumber = 101;

    if (lastAllowance && lastAllowance.allowanceticket) {
      const lastTicketNumber = parseInt(lastAllowance.allowanceticket.split('-')[1], 10);
      nextTicketNumber = lastTicketNumber + 1;
    }

    return `AR-${nextTicketNumber}`;
  } catch (error) {
    console.error("Error generating allowance ticket:", error);
    throw new Error("Unable to generate allowance ticket");
  }
};

allowanceSchema.pre('validate', async function (next) {
  if (!this.allowanceticket) {
    try {
      this.allowanceticket = await this.constructor.generateAllowanceTicket();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

allowanceSchema.statics.createWithAllowanceTicket = async function (data) {
  try {
    const { createdby, ...restData } = data;

    if (!createdby) {
      throw new Error("createdby is required");
    }

    const newAllowance = new this({
      ...restData,
      createdby,
    });
    const savedAllowance = await newAllowance.save();

    // Debug logs
    console.log("Created Allowance:", savedAllowance);
    console.log("User ID for update:", createdby);

    
    await User.updateOne(
      { _id: createdby },
      { $push: { allowances: savedIssue._id } }
    );
    

    return savedAllowance;
  } catch (error) {
    console.error("Error creating allowance:", error);
    throw error;
  }
};  
const Allowance = mongoose.model('Allowance', allowanceSchema);

module.exports = Allowance;
