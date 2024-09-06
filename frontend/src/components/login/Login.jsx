import React, { useEffect, useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Button from "@mui/material/Button";
import { FaEye } from "react-icons/fa";
import { AiFillEyeInvisible } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import ForgotPassword from "../forgotPassword/forgotPassword";
import { showErrorToast, showSuccesToast } from "../../utils/toastUtils";
import { encryptPassword, isValidEmail } from "../../utils/utils";
import { useAuth } from "../../contexts/AuthContext";

let flag = true;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const { setAuthUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("form data inside useEffect", formData);
    if (flag) {
      flag = false;
    } else {
      checkValidations();
    }
  }, [formData]);

  const checkValidations = () => {
    console.log("inside checkValidations");

    console.log("form insie check validations", formData);

    // Object to store error messages
    let errors = {};

    // Check if email is empty
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      // Assuming isValidEmail is a function that checks if the email is valid
      errors.email = "Email is invalid.";
    }

    // Check if password is empty
    if (!formData.password) {
      errors.password = "Password is required.";
    }
    console.log("error", errors);

    // If there are errors, set them and return false
    if (Object.keys(errors).length > 0) {
      console.log("inside error setting...................");
      setErrors(errors);
      return false;
    } else {
      setErrors({});
      console.log("inside else........................");
    }

    return true; // Return true if no validation errors
  };

  const handleEye = () => {
    setShowPassword(true);
  };

  const handleEyetwo = () => {
    setShowPassword(false);
  };

  const handleForgotPass = () => {
    setShowForgotPasswordModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("formdata", formData);
    const isValid = checkValidations();

    console.log("isValid..........", isValid);

    if (isValid) {
      //encrypting the password here

      const encryptedPassword = encryptPassword(formData.password);

      const updatedFormData = { ...formData, password: encryptedPassword };

      setLoading(true);
      try {
        console.log("calling login api");
        const response = await axios.post(
          "http://localhost:3001/api/auth/login",
          updatedFormData
        );
        console.log("response getting");
        console.log("response in login", response.data);
        setResponse(response.data);

        showSuccesToast("Login successful!");

        // Store token in localStorage or state management
        setAuthUser(response.data);
        //localStorage.setItem("token", response.data.token);
        // Redirect to dashboard or home page
        navigate("/");
      } catch (err) {
        console.log("inside error", err);
        if (err.response && err.response.status === 401) {
          console.log("inside 401 invalid credentials");

          showErrorToast("Invalid email or password");

          //setErrors({ password: "Invalid email or password." });
        } else if (err.response && err.response.status === 400) {
          console.log("inside 400 missing credentials");

          //setErrors({ email: "Email is required.", password: "Password is required." });
        } else {
          console.log("error in calling login api", err);
          showErrorToast("Error Logging In.");
          //  setErrors({ general: "Error logging in." });
        }
      } finally {
        console.log("finally block work");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="login d-flex justify-content-center align-items-center">
        <div className="login-container bg-white text-center">
          <img
            className="m-5"
            src="login.svg"
            height={400}
            width={400}
            alt="Login Illustration"
          />
          <div className="login-item">
            <form onSubmit={handleSubmit}>
              <h3 className="text-center mt-5">Log in</h3>
              <TextField
                className="login-textfield m-4"
                id="email"
                name="email"
                label="Email Id"
                variant="filled"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                className="login-textfield m-4"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="filled"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              {showPassword ? (
                <div className="eyeicon" onClick={handleEyetwo}>
                  <AiFillEyeInvisible />
                </div>
              ) : (
                <div className="eyeicon" onClick={handleEye}>
                  <FaEye />
                </div>
              )}
              <Link
                className="login-forgotpass-link text-decoration-none"
                onClick={handleForgotPass}
              >
                Forgot password?
              </Link>
              <Button
                className="login-btn m-4 black-bg"
                variant="contained"
                type="submit"
                sx={{
                  backgroundColor: "#0B2B47",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#0B2B47",
                  },
                }}
                disabled={loading}
              >
                Log in
              </Button>
              {errors.general && <p className="error-text">{errors.general}</p>}
            </form>
          </div>
        </div>
      </div>
      <Modal
        show={showForgotPasswordModal}
        onHide={() => setShowForgotPasswordModal(false)}
        dialogClassName="forgotpass-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ForgotPassword />
        </Modal.Body>
      </Modal>
    </>
  );
}
