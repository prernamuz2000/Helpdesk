import React, { useEffect, useState } from "react";
import { Typography, Box, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Layout from "../header/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { showErrorToast, showSuccesToast } from "../../utils/toastUtils";

import UpdateTicket from "./UpdateTicket/UpadateTicket";
import { useNavigateToLogin } from "../../utils/navigateUtils";

const UserTickets = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const validStatuses = ["Open", "In Progress", "On Hold", "Resolved"];
  const { user, logout } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigateToLogin = useNavigateToLogin();
  //for updating ticket

  const [editModalOpen, setEditModalOpen] = useState(false);
  const handleEditTicket = (id) => {
    const ticketToEdit = rows.find((ticket) => ticket.id === id);
    setSelectedTicket(ticketToEdit);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    console.log(
      "ticket s updated now refrshed the state ................55555555555."
    );
    setEditModalOpen(false);
    setSelectedTicket(null);
    fetchTickets();
  };

  const handleUpdateTicket = () => {
    // Add your update logic here
    console.log("Ticket updated:");
    handleCloseEditModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTicket((prevTicket) => ({
      ...prevTicket,
      [name]: value,
    }));
  };
  const columns = [
    {
      field: "srno",
      headerName: "Sr. No.",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "ticketCode",
      headerName: "Ticket Code",
      width: 170,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "category",
      headerName: "Category",
      width: 120,
      align: "center",
      headerAlign: "center",
    },

    {
      field: "description",
      headerName: "Description",
      width: 370,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            whiteSpace: "normal", // Allows text to wrap
            wordWrap: "break-word", // Breaks long words to fit within the container
            overflow: "hidden", // Hides any overflowing content
            textOverflow: "ellipsis", // Adds ellipsis for overflowing text
            maxHeight: "5.6em", // Limits height (roughly 3 lines of text)
            lineHeight: "1.2em", // Line height for each line of text
            marginTop: "10px"
          }}
        >
          {params.value}
        </Box>
      ),
    },

    {
      field: "status",
      headerName: "Status",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 110,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleEditTicket(params.row.id)}
          sx={{
            color: "#0B2B47",
          }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];


  //declaring fetch tickets 
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("user id", user.userId);
      const response = await axios.get(
        `http://localhost:3001/tickets/${user.userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // Bearer token for authentication
          },
        }
      );

      if (response.data.length === 0) {
        showErrorToast("No tickets available");
      }
      const data = response.data.map((ticket, index) => ({
        id: ticket._id,
        srno: index + 1,
        ticketCode: ticket.ticketCode,
        createdAt: new Date(ticket.createdAt).toLocaleDateString(),
        category: ticket.category,
        status: ticket.status, // Show "Open" in the status column
        createdBy: ticket.email,
        priority: ticket.priority || "High", // Use the priority from backend or default to High
        subcategory: ticket.subcategory,
        assignTo: ticket?.assignedTo, // Show "Admin" in the Assign To column
        description: ticket.description,
        file: ticket.file,
        fileName: ticket?.file?.filename,
        fileUrl: ticket?.file?.url,
        comments: ticket?.comments.comment || "",
      }));

      setRows(data); // Assuming response.data is an array of tickets
    } catch (err) {
      console.log("err response", err.response);

      if (err?.response) {
        // Server responded with an error status
        const { data } = err.response;

        if (data.middlewareError) {
          // Specific handling for middleware-related errors
          console.error("Middleware Error:", data.message);
          showErrorToast("Session Expired");
          logout();
          navigateToLogin();
          return;
        }
      }
      if (err.response && err.response.status === 404) {
        showErrorToast("User not found. Please check the user ID.");
        setError("User not found. Please check the user ID.");
        console.error("Error fetching tickets:", error);
        console.log("no any tickets found");
      } else {
        console.log("error server error");
        showErrorToast("Erro Fetching Tickets");
        setError("Error fetching tickets. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          maxWidth: "1400px", // Max width to ensure it doesn't stretch too wide
          margin: "0 auto", // Center the container
          alignItems: "center", // Center items horizontally
          minHeight: "100vh", // Make sure the container takes full height of the viewport
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "20px", // Space between heading and DataGrid
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
                marginBottom: "0", // Remove bottom margin
              }}
            >
              ALL TICKETS
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "10px",
            }}
          >
            <Link to="/createticket" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#0B2B47",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#08203b",
                  },
                }}
              >
                Add Tickets
              </Button>
            </Link>
          </Box>
        </Box>
        <Box sx={{ height: 550, width: 1200}}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            fullWidth
            disableColumnResize
            sx={{
              // Header styling
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#0B2B47", // Dark blue background for headers
                color: "#fff", // White text
                fontWeight: "bold", // Make headers bold
                textAlign: "center",
              },
              // Cell text color styling
              "& .MuiDataGrid-cell": {
                color: "#0B2B47", // Dark blue color for the text
              },
              // Remove cell outline on focus
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              // Sort icon color for header
              "& .MuiDataGrid-sortIcon": {
                color: "#fff !important", // White sort icon for visibility
              },
            }}
          />
        </Box>
      </Box>
      <UpdateTicket
        open={editModalOpen}
        onClose={handleCloseEditModal}
        ticket={selectedTicket}
        onChange={handleInputChange}
        onSave={handleUpdateTicket}
      />
    </Layout>
  );
};

export default UserTickets;
