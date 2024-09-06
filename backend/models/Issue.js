const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./User");

const fileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
});

const issueSchema = new Schema({
  employeeName: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  floor: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    ref: "Category", 
    required: true,
  },
  subcategory: {
    type: String,
    ref: "Subcategory", 
    required: true,
  },
  description: {
    type: String,
  },
  file: {
    type: fileSchema,
    required: false,
  },
  ticketCode: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: {
      name: { type: String, required: true }, 
      email: { type: String, required: false },
      employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    required: false, 
  },
  status: {
    type: String,
    enum: ["Open", "Resolved", "On Hold", "In Progress"],
    default: "Open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdby:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  //adding timestamps to comment
  comments: {
    comment: { type: String, default: "" },
    date: { type: Date, default: Date.now }
  },
  staffComments: {
    comment: { type: String, default: "" },
    date: { type: Date, default: Date.now }
  }
});

issueSchema.statics.createWithTicket = async function (data) {
  try {
    
    // Find the last ticket and sort by the latest createdAt
    const lastTicket = await this.findOne({})
      .sort({ createdAt: -1 }) 
      .select("ticketCode") 
      .lean(); 
    let nextTicketNumber = 101; 
    if (lastTicket && lastTicket.ticketCode) {
     
      const lastTicketNumber = parseInt(lastTicket.ticketCode.split("-")[1], 10);
      
      nextTicketNumber = lastTicketNumber + 1;
    }

    
    const ticketCode = "TIC-" + nextTicketNumber;

    
    const { employeeId, createdby, ...restData } = data;

    
    if (!employeeId || !createdby) {
      throw new Error("employeeId and createdby are required");
    }

    
    const issueData = {
      ...restData,
      employeeId,
      createdby,
      ticketCode, 
    };

   
    const newIssue = new this(issueData);


    const savedIssue = await newIssue.save();

    
    await User.updateOne(
      { _id: createdby },
      { $push: { tickets: savedIssue._id } }
    );

    return savedIssue; 
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error; 
  }
};

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
