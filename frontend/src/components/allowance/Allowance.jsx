import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  Container,
  Grid,
  MenuItem,
} from "@mui/material";
import Layout from "../header/Layout";
import { IoIosAddCircle } from "react-icons/io";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import { useHandleMiddlewareError } from "../../hooks/useHandleMiddlewareError";
import { showErrorToast } from "../../utils/toastUtils";
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel, Select,  FormHelperText } from '@mui/material';

const Allowance = () => {

  const navigate = useNavigate();
  const [entries, setEntries] = useState([
    { date: "", category: "", amount: "", description: "", file: null },
  ]);
  const [fileErrors, setFileErrors] = useState([""]);
  const [tpmEmail, setTpmEmail] = useState(""); // TPM email state
  const [emailError, setEmailError] = useState("");
  const { user } = useAuth();
  const handleMiddlewareError = useHandleMiddlewareError();

  const handleInputChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024;
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (
        fileSize > 1 ||
        !["jpeg", "jpg", "png", "pdf"].includes(fileExtension)
      ) {
        const error =
          fileSize > 1
            ? "File size should be less than 1MB"
            : "Only JPEG, PNG, and PDF formats are allowed";

        const newFileErrors = [...fileErrors];
        newFileErrors[index] = error;
        setFileErrors(newFileErrors);
        e.target.value = ""; // Clear the file input
      } else {
        const newEntries = [...entries];
        newEntries[index].file = file;
        setEntries(newEntries);

        const newFileErrors = [...fileErrors];
        newFileErrors[index] = "";
        setFileErrors(newFileErrors);
      }
    }
  };

  const addNewRow = () => {
    setEntries([
      ...entries,
      { date: "", category: "", description: "", amount: "", file: null },
    ]);
    setFileErrors([...fileErrors, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   

    try {
      const formData = new FormData();

      entries.forEach((entry, index) => {
        formData.append(`entries[${index}].date`, entry.date);
        formData.append(`entries[${index}].category`, entry.category);
        formData.append(`entries[${index}].description`, entry.description);
        formData.append(`entries[${index}].amount`, entry.amount);
        // Append file data if present
        if (entry.file) {
          formData.append("file", entry.file); // Use the same name as in multer
        }
      });

      formData.append("tpmMail", tpmEmail);
      formData.append("createdby", user.userId);

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/attach`,
        formData,
        {
          headers: {
            "Content-Type": "multipReact_APP_API_TICKETart/form-data",
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      toast.success("Request submitted successfully");
      navigate("/userallowance")
      console.log("Success:", response.data);
    } catch (error) {
      if (!handleMiddlewareError(error)) {
        showErrorToast("Error in Creating  Request");
      }

      //toast.error("Error in creating request");
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Allowance Request
        </Typography>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {entries.map((entry, index) => (
            <Grid
              container
              spacing={2}
              key={index}
              alignItems="center"
              sx={{ marginBottom: 2 }}
            >
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  required
                  value={entry.date}
                  onChange={(e) =>
                    handleInputChange(index, "date", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  required
                  value={entry.category}
                  onChange={(e) =>
                    handleInputChange(index, "category", e.target.value)
                  }
                >
                  <MenuItem value="Place of Visit">Place of Visit</MenuItem>
                  <MenuItem value="Hotel">Hotel</MenuItem>
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Petrol">Petrol</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={1}
                  value={entry.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={1.5}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={entry.amount}
                  onChange={(e) =>
                    handleInputChange(index, "amount", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} sm={2.5}>
  <FormControl fullWidth required error={!!emailError}>
    <InputLabel>Approver's Email</InputLabel>
    <Select
      value={tpmEmail}
      onChange={(e) => {
        setTpmEmail(e.target.value);
       
      }}
      label="Approver's Email"
    >
      <MenuItem value="">
        <em>Select your Tpm's mail</em>
      </MenuItem>
      <MenuItem value="vikram@antiersolutions.com">vikram@antiersolutions.com</MenuItem>
      <MenuItem value="surinder.k@antech.in">surinder.k@antech.in</MenuItem>
      <MenuItem value="swati.rana@antech.in">swati.rana@antech.in</MenuItem>
      <MenuItem value="atul.sharma@antech.in">atul.sharma@antech.in</MenuItem>
      <MenuItem value="sohit.ahuja@antiersolutions.com">sohit.ahuja@antiersolutions.com</MenuItem>
      <MenuItem value="parminder.gill@antiersolutions.com">parminder.gill@antiersolutions.com</MenuItem>
      <MenuItem value="Shashi@antiersolutions.com">shashi@antiersolutions.com</MenuItem>
      <MenuItem value="karan.bhai@antiersolutions.com">karan.bhai@antiersolutions.com</MenuItem>
      <MenuItem value="gagandeep@antiersolutions.com">gagandeep@antiersolutions.com</MenuItem>
      <MenuItem value="ankit.bhatia@antiersolutions.com">ankit.bhatia@antiersolutions.com</MenuItem>
      <MenuItem value="karan@antiersolutions.com">karan@antiersolutions.com</MenuItem>
      <MenuItem value="karan.chopra@antiersolutions.com">karan.chopra@antiersolutions.com</MenuItem>
    </Select>
    {emailError && <FormHelperText>{emailError}</FormHelperText>}
  </FormControl>
</Grid>

              <Grid item xs={12} sm={1}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{
                    backgroundColor: "#0B2B47",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#0B2B47",
                    },
                  }}
                >
                  Upload
                  <input
                    type="file"
                    hidden
                    accept=".jpeg,.jpg,.png,.pdf"
                    onChange={(e) => handleFileChange(index, e)}
                  />
                </Button>
                {fileErrors[index] && (
                  <Typography color="error" variant="body2">
                    {fileErrors[index]}
                  </Typography>
                )}
              </Grid>
            </Grid>
          ))}
          <Box display="flex" justifyContent="center">
            <Button
              variant="outlined"
              onClick={addNewRow}
              sx={{
                backgroundColor: "#0B2B47",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0B2B47",
                },
                padding: "5px",
                fontSize: "20px",
                width: "10px",
              }}
            >
              <IoIosAddCircle />
            </Button>
          </Box>
          <Box display="flex" justifyContent="end">
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: "#0B2B47",
                marginTop: 3,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0B2B47",
                },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Allowance;
