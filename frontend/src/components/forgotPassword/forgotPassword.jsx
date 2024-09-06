import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import "./forgotPassword.css";
import { showErrorToast, showSuccesToast } from "../../utils/toastUtils";
import useForgotPassword from "../../hooks/useForgotPassword";

export default function ForgotpassModal({ handleClose }) {
  const [email, setEmail] = useState("");
  const { loading, response, setResponse, forgotPassword } = useForgotPassword();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  

  useEffect(() => {
    if (response) {
      console.log("use effect");
      showSuccesToast("New password sent to your email.");
    }

    return () => {
      setResponse(null);
    };
  }, [response]);

  const handleSumbit = async (e) => {
    e.preventDefault();
    console.log("loadin", loading);

    if (!loading) {
      try {
        console.log("calling api in component");
        const res = await forgotPassword(email);
        console.log("getting api result res", response);
      } catch (error) {
        console.log("inside error component");
      }
    }
  };
  return (
    <>
      <form>
        <TextField
          className="forgotpass m-4"
          id="filled-basic"
          label="Email Id"
          variant="filled"
          value={email}
          onChange={handleChange}
        />
        <Button
          className="forgotpass m-4"
          variant="contained"
          type="submit"
          sx={{ bgcolor: "#0B2B47" }}
          onClick={handleSumbit}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          Submit
        </Button>
      </form>
    </>
  );
}
