import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import "./Upadate.css";
import { showErrorToast, showSuccesToast } from "../../../utils/toastUtils";
import usePutApi from "../../../hooks/usePutApi";
import { useAuth } from "../../../contexts/AuthContext";

const UpdateTicket = ({ open, onClose, ticket }) => {

  const [previousData, setPreviousData] = useState({
    status: '',
    subcategory: '',
    category: '',
    comments: '',
    assignedToEmail: '',
  });

  console.log("ticket from admin ticket:", ticket);
  const [previousStatus, setPreviousStatus] = useState('');  // For storing the new comment
  const [previousComment, setPreviousComment] = useState('');  // For storing the last (previous) comment


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

  const [loading, setloading] = useState(null);
  const [response, setResponse] = useState(null);

  const [formData, setFormData] = useState({
    category: ticket?.category || "",
    subcategory: ticket?.subcategory || "",
    status: ticket?.status || "",
    assignedTo: ticket?.asignTo || { name: "", email: "", _id: "" },
    comments: ticket?.comments || "",
    description: ticket?.description || "",
  });

  useEffect(() => {
    console.log('ticket inside update ticket admin', ticket);
    setPreviousData({
      status: ticket?.status,
      subcategory: ticket?.subcategory,
      category: ticket?.category,
      comments: ticket?.comments,
      assignedTo: ticket?.asignTo,
    });

    setFormData({
      category: ticket?.category || "",
      subcategory: ticket?.subcategory || "",
      status: ticket?.status || "",
      assignedTo: ticket?.assignTo || { name: "", email: "", _id: "" },
      comments: ticket?.comments || "",
      description: ticket?.description,
    });
    setSelectedCategory(ticket?.category);
    setSelectedSubcategory(ticket?.subcategory);
    setPreviousComment(ticket?.comments);
    setPreviousStatus(ticket?.status);
  }, [ticket]);

  useEffect(() => {
    setSelectedCategory(ticket?.category);
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/allCategory`);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showErrorToast("Failed to fetch categories. Please try again later.");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/emails?category=${selectedCategory}&subcategory=${selectedSubcategory}`
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
  const handleCommentChange = (e) => {
    const comment = e.target.value.trim(); // Trim the whitespace from the comment
    setFormData((prevFormData) => ({ ...prevFormData, comments: comment }));
  };
  const handleSubcategoryChange = (e) => {
    const subcategory = e.target.value;
    setSelectedSubcategory(subcategory);
    setFormData((prevFormData) => ({ ...prevFormData, subcategory }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.comments = formData.comments.trim();
    // Validation check
    if (
      !formData.category ||
      !formData.subcategory ||
      !formData.status ||
      !formData.comments ||
      !formData.assignedTo.name
      /* uncommet when u work on department email fetching data ok
    !formData.assignedTo.email*/
    ) {
      showErrorToast("Please fill all the required fields.");
      return;
    }
    console.log('prev form data before submitting', previousData);

    if (ticket?.category === formData.category
      && ticket.subcategory === formData.subcategory
      && ticket?.status === formData.status
      && ticket?.comments === formData.comments
      && ticket?.assignedToEmail === formData.assignedTo?.email) {
      showErrorToast("No changes detected. Please update ticket before submitting.");
      return;
    }
    //check if previos comment is equal to latestComment
    console.log('ticket before submitting ticket', ticket);
    console.log('Prev form data before submitting', previousData);


    try {
      // Perform the PUT request
      setloading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/admin/editTicket/${ticket.ticketCode}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      // Access the response data from the hook
      if (response) {
        // Assuming response contains status code or similar info
        if (response.status === 200) {
          showSuccesToast("Ticket updated successfully.");

          setTimeout(async () => {
            await onClose();
          }, 1000);

          // Optionally close the modal or refresh the ticket list
          // handleCloseEditModal(); // Close the modal
          // Refresh or update the ticket list here if needed
        }
      }
    } catch (error) {
      // Handle errors
      showErrorToast("Failed to update the ticket.");
      console.error("Error updating ticket:", error.message);
    } finally {
      setloading(null);
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
      <h3 className="Edit-Heading text-center p-2">Edit Ticket</h3>
      <DialogContent>
        {ticket && (
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.name} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Subcategory</InputLabel>
                <Select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleSubcategoryChange}
                  label="Subcategory"
                >
                  {subcategories.map((subcat) => (
                    <MenuItem key={subcat.type} value={subcat.type}>
                      {subcat.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
              <Autocomplete
                options={
                  emails
                    ? emails.map((data) => {
                      return data.name;
                    })
                    : []
                }
                value={formData.assignedTo.name}
                onChange={(e, newValue) => {
                  const staff = emails.find((data) => data.name === newValue);
                  const email = staff ? staff.email : "";
                  onInputChange({
                    target: {
                      name: "assignedTo",
                      value: { name: newValue, email: email },
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Assign To" variant="outlined" />
                )}
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
                      const backendUrl = `${process.env.REACT_APP_API_BASE_URL}${ticket?.fileUrl}`;
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
        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#0B2B47",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0B2B47",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{
            backgroundColor: "#0B2B47",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#0B2B47",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTicket;
