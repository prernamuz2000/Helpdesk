import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Button,
  Grid,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import "./CreateTicket.css";
import Layout from "../header/Layout";
import { showErrorToast, showSuccesToast } from "../../utils/toastUtils";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useHandleMiddlewareError } from "../../hooks/useHandleMiddlewareError";

const CreateTicket = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeIdError, setEmployeeIdError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const handleMiddlewareError = useHandleMiddlewareError();

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
    if (selectedCategory) {
      setSubcategories(selectedCategory.subcategories || []);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const handleFileChange = (e) => {
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
  };

  const validateEmail = (email) => {
    const emailDomain = "@antiersolutions.com";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }

    if (email.split("@").length !== 2) {
      setEmailError("Email cannot contain multiple @ symbols");
      return false;
    }

    /*if (!email.endsWith(emailDomain)) {
      setEmailError(`Email must end with ${emailDomain}`);
      return false;
    }*/

    setEmailError("");
    return true;
  };

  const validateEmployeeId = (employeeId) => {
    const validPrefixes = ["ATR", "INT"];
    if (!validPrefixes.some((prefix) => employeeId.startsWith(prefix))) {
      setEmployeeIdError("Employee ID must start with ATR or INT");
      return false;
    }
    setEmployeeIdError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !employeeName ||
      !employeeId ||
      !email ||
      !floor ||
      !selectedCategory ||
      !selectedSubcategory ||
      !description
    ) {
      showErrorToast("Please fill all the required fields.");
      return;
    }

    if (!validateEmail(email) || !validateEmployeeId(employeeId)) {
      return; // Stop the submission if email or employee ID is not valid
    }

    const formData = new FormData();
    formData.append("employeeName", employeeName);
    formData.append("employeeId", employeeId);
    formData.append("email", email);
    formData.append("floor", floor);
    formData.append("description", description);
    formData.append(
      "categoryId",
      selectedCategory ? selectedCategory.name : ""
    );
    formData.append(
      "subcategoryId",
      selectedSubcategory ? selectedSubcategory.type : ""
    );
    formData.append("createdby", user.userId);

    if (file) {
      formData.append("file", file);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/send`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      setFile(null);
      setFileName("No file chosen");
      setEmployeeName("");
      setEmployeeId("");
      setEmail("");
      setFloor("");
      setDescription("");
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setLoading(false);
      showSuccesToast("Ticket created and acknowledgment emails sent!");
      navigate("/tickets");
    } catch (error) {
      if (!handleMiddlewareError(error)) {
        showErrorToast("Failed to assign the ticket. Please try again later.");
      }
      console.error("Error creating ticket:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="md" className="container">
        <Typography
          variant="h4"
          gutterBottom
          className="text-center"
          sx={{
            fontWeight: "bold",
            color: "#0B2B47",
            marginBottom: "20px",
          }}
        >
          Create Ticket
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee ID"
                value={employeeId}
                onChange={(e) => {
                  setEmployeeId(e.target.value);
                  validateEmployeeId(e.target.value); // Validate employee ID on change
                }}
                required
                error={Boolean(employeeIdError)} // Display error style if employee ID is invalid
                helperText={employeeIdError} // Display the validation message
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value); // Validate email on change
                }}
                required
                error={Boolean(emailError)} // Display error style if email is invalid
                helperText={emailError} // Display the validation message
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Floor"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={categories}
                getOptionLabel={(option) => option.name || ""}
                value={selectedCategory}
                onChange={(event, newValue) => {
                  setSelectedCategory(newValue);
                  setSelectedSubcategory(null);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Category" required />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={subcategories}
                getOptionLabel={(option) => option.type || ""}
                value={selectedSubcategory}
                onChange={(event, newValue) => {
                  setSelectedSubcategory(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Subcategory" required />
                )}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                required
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="space-between">
              <Grid item>
                <Button
                  variant="contained"
                  component="label"
                  className="upload-button"
                  sx={{
                    backgroundColor: "#0B2B47",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#0B2B47",
                    },
                  }}
                >
                  Choose File
                  <input
                    type="file"
                    hidden
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.gif"
                  />
                </Button>
                <Typography variant="body1" sx={{ mt: 1, ml: 1 }}>
                  {fileName}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  className="submit-button"
                  disabled={loading}
                  sx={{
                    backgroundColor: "#0B2B47",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#0B2B47",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: "#fff" }} />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Layout>
  );
};

export default CreateTicket;
