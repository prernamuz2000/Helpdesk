const express = require('express');
const router = express.Router();
const upload = require("../middlewares/upload");
const { sendAcknowledgement, getTicketsAssignedToStaff } = require('../controllers/ticketController');
const editTicketStaff = require('../controllers/editTicketStaff');
const editTicketUser = require('../controllers/editTicketUser');
const authMiddleware = require('../middlewares/authMiddleware');
const editTicketEmployee = require('../controllers/editTicketEmployee');
const { getAgentsWithOpenTickets } = require('../controllers/agentsController');
// Route for editing tickets by staff
router.put("/editTicketStaff/:ticketCode", editTicketStaff);

// Route for getting tickets assigned to staff
router.get('/assignedTickets/:staffId', authMiddleware(), getTicketsAssignedToStaff);

// Corrected: Consistent parameter naming for ticketCode
router.put('/editTicketUser/:ticketCode', upload.single('file'), editTicketUser);

router.put('/editTicketEmployee/:ticketCode', upload.single('file'), editTicketEmployee);
router.get('/agents', getAgentsWithOpenTickets);

module.exports = router;
