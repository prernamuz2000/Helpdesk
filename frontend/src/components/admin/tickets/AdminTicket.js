import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { MoreVert, Edit as EditIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../header/Layout";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import UpdateTicket from "../UpdateTicket/UpadateTicket";
import { create } from "@mui/material/styles/createTransitions";
import { useHandleMiddlewareError } from "../../../hooks/useHandleMiddlewareError";
import { showErrorToast } from "../../../utils/toastUtils";

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    ticketCode: "",
    category: "",
    priority: "",
    status: "",
  });
  const [pageSize, setPageSize] = useState(5);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleMiddlewareError = useHandleMiddlewareError();

  const { user } = useAuth();
  const validStatuses = ["Open", "In Progress", "On Hold", "Resolved"];
  async function getTickets() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/getTickets`,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

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
        comments: ticket.comments?.comment || "",
        assignToEmail: ticket?.assignedTo.email || "",
      }));
      setTickets(data);
      setLoading(false);
      console.log("Tickets fetched:", response.data);
    } catch (error) {
      if (!handleMiddlewareError(error)) {
        if (error?.response && error?.response.status === 404) {
          showErrorToast("No tickets available");
        } else {
          showErrorToast("Error fetching tickets");
        }
      }

      setError(error);
      console.log("Error fetching tickets:", error.response);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getTickets();
  }, [user.token]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleEditTicket = (id) => {
    const ticketToEdit = tickets.find((ticket) => ticket.id === id);
    setSelectedTicket(ticketToEdit);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    console.log(
      "ticket s updated now refrshed the state ................55555555555."
    );
    setEditModalOpen(false);
    setSelectedTicket(null);
    getTickets();
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
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "ticketCode",
      headerName: "Ticket Code",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography sx={{ marginTop: "10px" }}>{params.row.status}</Typography>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "assignTo",
      headerName: "Assign To",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <Typography sx={{ marginTop: "10px" }}>
          {params.row.assignTo?.name ?? "Not Assigned"}
        </Typography>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.7,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleEditTicket(params.row.id)}
          sx={{ color: "#0B2B47" }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  // Apply filters to tickets data
  const filteredTickets = tickets.filter((row) => {
    const { ticketCode, category, priority, status } = filters;
    const matchesCode =
      !ticketCode ||
      row.ticketCode.toLowerCase().includes(ticketCode.toLowerCase());
    const matchesCategory =
      !category || row.category.toLowerCase() === category.toLowerCase();
    const matchesPriority =
      !priority || row.priority.toLowerCase() === priority.toLowerCase();
    const matchesStatus =
      !status || row.status.toLowerCase() === status.toLowerCase();
    return matchesCode && matchesCategory && matchesPriority && matchesStatus;
  });

  return (
    <Layout>
      <Box sx={{ padding: "20px", marginLeft: "0" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" sx={{ textAlign: "center" }}>
            Ticket Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton>
              <MoreVert />
            </IconButton>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0B2B47",
                color: "white",
                "&:hover": {
                  backgroundColor: "#0B2B47",
                },
              }}
            >
              <Link
                to="/createTicket"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Add Ticket
              </Link>
            </Button>
          </Box>
        </Box>
        <Box sx={{ marginTop: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Ticket Code"
                name="ticketCode"
                value={filters.ticketCode}
                onChange={handleFilterChange}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={filters.priority}
                  onChange={handleFilterChange}
                  label="Priority"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  {validStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ marginTop: 4, height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredTickets}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 15]}
            loading={loading}
            error={error}
            disableSelectionOnClick
            disableColumnResize
            sx={{
              // Custom styles for DataGrid
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#0B2B47",
                color: "#fff",
              },
              "& .MuiDataGrid-cell": {
                color: "#0B2B47", // Change cell text color if desired
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              "& .MuiDataGrid-sortIcon": {
                color: "#fff !important",
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

export default AdminTickets;
