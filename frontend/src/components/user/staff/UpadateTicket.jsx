import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, Button, Grid, FormControl, TextField, Autocomplete, Typography, CircularProgress, InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import "./Upadate.css";
import { showErrorToast, showSuccesToast } from "../../../utils/toastUtils";
import { useAuth } from "../../../contexts/AuthContext";

const UpdateTicket = ({ open, onClose, ticket }) => {
  const { user } = useAuth();
  const [emails, setEmails] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    ticket?.category || ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    ticket?.subcategory || ""
  );
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(
    ticket?.file?.filename || "No file chosen"
  );

  const [loading, setLoading] = useState(null);
  const [response, setResponse] = useState(null);

  const [formData, setFormData] = useState({
    category: ticket?.category || "",
    subcategory: ticket?.subcategory || "",
    status: ticket?.status || "",
    assignedTo: ticket?.assignTo || { name: "", email: "", _id: "" },
    comments: ticket?.comments || "",
    description: ticket?.description || "",
  });

  useEffect(() => {
    setFormData({
      category: ticket?.category || "",
      subcategory: ticket?.subcategory || "",
      status: ticket?.status || "",
      assignedTo: ticket?.assignTo || { name: "", email: "", _id: "" },
      comments: ticket?.comments || "",
      description: ticket?.description,
    });
    console.log("ticket inside staff edit ticket", ticket);
    setSelectedCategory(ticket?.category);
    setSelectedSubcategory(ticket?.subcategory);
  }, [ticket]);
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/emails?category=${selectedCategory}&subcategory=${selectedSubcategory}`
        );
        setEmails(response.data.staffEmails);
      } catch (err) {
        console.error("error in fetching emails", err.message);
      }
    };
    fetchEmails();
  }, [selectedSubcategory]);
  useEffect(() => {
    if (selectedCategory) {
      const selectedCat = categories.find(
        (cat) => cat.name === selectedCategory
      );
      setSubcategories(selectedCat?.subcategories || []);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory, categories]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setFormData((prevFormData) => ({ ...prevFormData, category }));
  };

  const handleSubcategoryChange = (e) => {
    const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);
    setFormData((prevFormData) => ({ ...prevFormData, subcategory }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.comments || !formData.assignedTo.name) {
      showErrorToast("Please fill all the required fields.");
      return;
    }

    try {
      console.log("ticketcode before sending", ticket.ticketCode);

      console.log("form data before assigning", formData);

      setLoading(true);
      const response = await axios.put(
        `http://localhost:3001/api/tickets/editTicketStaff/${ticket.ticketCode}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      if (response) {
        if (response.status === 200) {
          showSuccesToast("Ticket updated successfully.");
          setTimeout(async () => {
            await onClose();
          }, 1000);
        }
      }
    } catch (error) {
      showErrorToast("Failed to update the ticket.");
      console.error("Error updating ticket:", error.message);
    } finally {
      setLoading(null);
    }
  };

  const validStatuses = ["Open", "In Progress", "On Hold", "Resolved"];
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="edit-ticket-title"
      fullWidth
      maxWidth="sm"
    >
      <h3 className="Edit-Heading text-center p-2">Edit Ticket Staff</h3>
      <DialogContent>
        {ticket && (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleSubcategoryChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={onInputChange}
                  label="Status"
                >
                  {validStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
            <TextField
                fullWidth
                variant="outlined"
                label="Assign To"
                name="assignTo"
                value={formData.assignedTo.name}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Created On"
                name="createdOn"
                value={ticket.createdAt || ""}
                onChange={onInputChange}
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6} container alignItems="center" spacing={2}>
              <Grid item>
                <Typography variant="subtitle">Attached File:</Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    textTransform: "none",
                    width: "130px",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => {
                    if (ticket?.fileUrl) {
                      const backendUrl = `http://localhost:3001${ticket?.fileUrl}`;
                      window.open(backendUrl, "_blank");
                    }
                  }}
                >
                  {ticket?.fileName || "No file Chosen"}
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Description"
                name="description"
                value={formData.description || ""}
                onChange={onInputChange}
                InputProps={{
                  readOnly: true,
                }}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Add Comments"
                name="comments"
                value={formData.comments || ""}
                onChange={onInputChange}
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary"></Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#0B2B47",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0B2B47",
            }
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTicket;
