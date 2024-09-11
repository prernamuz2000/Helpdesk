import React, { useState, useEffect, useRef } from "react";
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
import "./Upadate.css"; // Fixed typo in filename
import { showErrorToast, showSuccesToast } from "../../../utils/toastUtils";
import { useAuth } from "../../../contexts/AuthContext";

const UpdateTicket = ({ open, onClose, ticket }) => {
  const { user } = useAuth();
  const [emails, setEmails] = useState([]);
  const isEmployee = user.role === "Employee";
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ticket?.category || "");
  const [selectedSubcategory, setSelectedSubcategory] = useState(ticket?.subcategory || "");
  const [file, setFile] = useState(null);

  const [fileName, setFileName] = useState(ticket?.file?.filename || "No file chosen");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const [formData, setFormData] = useState({
    category: ticket?.category || "",
    subcategory: ticket?.subcategory || "",
    status: ticket?.status || "",
    assignedTo: ticket?.assignTo || { name: "", email: "", _id: "" },
    comments: ticket?.comments || "",
    description: ticket?.description || "",
  });

  const fileInputRef = useRef(null); // Ref for file input

  useEffect(() => {
    console.log('ticket inside update ticket', ticket);

    setFormData({
      category: ticket?.category || "",
      subcategory: ticket?.subcategory || "",
      status: ticket?.status || "",
      assignedTo: ticket?.assignTo || { name: "", email: "", _id: "" },
      comments: ticket?.comments || "No comments",
      description: ticket?.description || "",
    });
    setSelectedCategory(ticket?.category);
    setSelectedSubcategory(ticket?.subcategory);
  }, [ticket]);

  useEffect(() => {
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
          `${process.env.REACT_APP_API_TICKET}/emails?category=${selectedCategory}&subcategory=${selectedSubcategory}`
        );

        setEmails(response.data.staffEmails);
      } catch (err) {
        console.error("Error fetching emails", err.message);
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

  const handleFileChange = (e) => {

    console.log('file changes update ......................5555');

    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const fileType = uploadedFile.type;
      const validFileTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];
      if (validFileTypes.includes(fileType)) {
        setFile(uploadedFile);
        setFileName(uploadedFile.name);
      } else {
        showErrorToast(
          "Only PDF and image files (JPEG, PNG, GIF) are allowed."
        );
        setFile(null);
        setFileName("No file chosen");
      }
    } else {
      setFile(null);
      setFileName("No file chosen");
    }


    //setFile(e.target.files[0]);
    //setFileName(e.target.files[0]?.name || "No file chosen");
  };

  const handleFileUpload = async () => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + user.token,
            },
          }
        );

        if (response.status === 200) {
          return response.data.fileUrl; // Assuming the backend responds with the file URL
        }
      } catch (error) {
        showErrorToast("Failed to upload the file.");
        console.error("Error uploading file:", error);
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.description
    ) {
      showErrorToast("Please fill all the required fields.");
      return;
    }


    try {
      setLoading(true);
      //const fileUrl = await handleFileUpload();
      const newFormData = new FormData();
      newFormData.append("description", formData.description);
      if (file) {
        newFormData.append("file", file);
      }


      const response = await axios.put(
        `${process.env.REACT_APP_API_TICKET}/tickets/editTicketEmployee/${ticket.ticketCode}`,
        newFormData,
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      );

      if (response.status === 200) {
        showSuccesToast("Ticket updated successfully.");
        setTimeout(async () => {
          await onClose();
        }, 1000);
      }
    } catch (error) {
      showErrorToast("Failed to update the ticket.");
      console.error("Error updating ticket:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const validStatuses = ["Open", "In Progress", "On Hold", "Resolved"];

  const onInputChange = (e, newValue) => {
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
                  disabled={true} // Disable for employees
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
                  disabled={true} // Disable for employees
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
                  disabled={true} // Disable for employees
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
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    assignedTo: { name: newValue, email: email },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Assign To"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {loading && <CircularProgress color="inherit" size={24} />}
                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                    disabled
                  />
                )}
                disabled
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
            <Grid item xs={6} container alignItems="center" spacing={1}>
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
              <Grid item xs={12}>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  name="file"

                  ref={fileInputRef}

                />
                <Typography>{fileName}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth

                multiline
                rows={2}
                variant="outlined"
                value={formData.description}
                onChange={onInputChange}

              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="comments"
                label="Comments"
                fullWidth
                multiline
                rows={1}
                variant="outlined"
                value={formData.comments}
                onChange={onInputChange}
                disabled={true} // Disable for employees
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" sx={{
          backgroundColor: "#0B2B47",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#0B2B47",
          },
        }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
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
          {loading ? <CircularProgress size={24} /> : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateTicket;
