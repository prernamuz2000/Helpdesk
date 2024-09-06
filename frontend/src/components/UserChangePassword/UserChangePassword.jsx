import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { encryptPassword } from "../../utils/utils";
import { showErrorToast, showSuccesToast } from "../../utils/toastUtils";
import { useAuth } from "../../contexts/AuthContext";

import styled from "@emotion/styled";

const CustomBox = styled(Box)`
  padding: 20px 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CustomForm = styled.form`
  width: 100%;
  max-width: 400px;
`;

const CustomButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  background-color: #001f3f;
  &:hover {
    background-color: #005bb5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
`;


const UserChangePassword = () => {
  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Old password is required."),
    newPassword: Yup.string()
      .required("New password is required.")
      .matches(/[a-z]/, "At least one lowercase letter is required.")
      .matches(/[A-Z]/, "At least one uppercase letter is required.")
      .matches(/[0-9]/, "At least one digit is required.")

      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        "At least one special character is required."
      )
      .min(8, "New password must be at least 8 characters long."),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords do not match.")
      .required("Please confirm your new password."),
  });

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log("oldps", values.oldPassword, "newps", values.newPassword);
        const encryptedOldPassword = encryptPassword(values.oldPassword);
        const encryptedNewPassword = encryptPassword(values.newPassword);
        console.log("oldencps", encryptedOldPassword);
        console.log("newencps", encryptedNewPassword);
        setLoading(true);
        if (!loading) {
        }
        const response = await axios.post(
          "http://localhost:3001/api/auth/changePassword",
          {
            empid: user.empid,
            currentPassword: encryptedOldPassword,
            newPassword: encryptedNewPassword,
          }
        );
        console.log("response ok", response);
        setLoading(false);
        showSuccesToast("Password changed successfully!");
        formik.resetForm();
      } catch (err) {
        console.log("inside catch of api", err.response.data);
        if (err.response && err.response.status === 400) {
          if (err.response.data.error === "Current Password Is Incorrect") {
            showErrorToast("The current password you entered is incorrect.");
          } else if (
            err.response.data.error ===
            "New Password is same as the old password"
          ) {
            showErrorToast("New password must be different from the old one");
          } else {
            showErrorToast(
              "An error occurred while changing the password code 400 "
            );

            console.log("inside else of All fields require");
          }
        } else {
          showErrorToast("An error occurred while changing the password");
        }
      } finally {
        setLoading(false);
      }
      setSubmitting(false);
    },
  });

  const handleClickShowPassword = (field) => {
    if (field === "old") setShowOldPassword(!showOldPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirmNew")
      setShowConfirmNewPassword(!showConfirmNewPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <CustomBox
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <CustomForm
        onSubmit={formik.handleSubmit}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <TextField
          label="Old Password"
          type={showOldPassword ? "text" : "password"}
          {...formik.getFieldProps("oldPassword")}
          fullWidth
          margin="normal"
          error={Boolean(
            formik.touched.oldPassword && formik.errors.oldPassword
          )}
          helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleClickShowPassword("old")}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showOldPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="New Password"
          type={showNewPassword ? "text" : "password"}
          {...formik.getFieldProps("newPassword")}
          fullWidth
          margin="normal"
          error={Boolean(
            formik.touched.newPassword && formik.errors.newPassword
          )}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleClickShowPassword("new")}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Confirm New Password"
          type={showConfirmNewPassword ? "text" : "password"}
          {...formik.getFieldProps("confirmNewPassword")}
          fullWidth
          margin="normal"
          error={Boolean(
            formik.touched.confirmNewPassword &&
            formik.errors.confirmNewPassword
          )}
          helperText={
            formik.touched.confirmNewPassword &&
            formik.errors.confirmNewPassword
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleClickShowPassword("confirmNew")}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <CustomButton
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
        >
          <ButtonContent>
            {loading && <CircularProgress size={24} color="inherit" />}
            {!loading && <span style={{ width: 24 }} />}{" "}
            {/* Placeholder to keep space when not loading */}
            &nbsp;Change Password
          </ButtonContent>
        </CustomButton>
      </CustomForm>
    </CustomBox>
  );
};

export default UserChangePassword;
