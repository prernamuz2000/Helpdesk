const express = require("express");
const { showData, getAllTickets } = require("../controllers/adminController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const updateTicketStatus = require("../controllers/updateticketstatus");
const edittickets = require("../controllers/ticketedit");
const router = express.Router();

router.post("/showData", showData);
router.get("/getTickets", getAllTickets);
router.put("/status/:ticketCode", updateTicketStatus);
router.put("/editTicket/:ticketCode",edittickets);

module.exports = router;
