import { useState } from "react";
import axios from "axios";
import { isValidEmail } from "../utils/utils";
import { showErrorToast, showSuccesToast } from "../utils/toastUtils";
import shadows from "@mui/material/styles/shadows";

const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  console.log("respinse asign", response);

  const forgotPassword = async (email) => {
    const success = handleInputErrors(email);
    if (!success) {
      return;
    }
    setLoading(true);
    setResponse(null);
    try {
      console.log("calling api in hook");
      const response = await axios.post(
        `${process.env.REACT_APP_API_AUTH}/forgotPassword`,
        { email }
      );
      console.log("response in forgot password hook", response);
      setResponse(response.data);

      //now setting response
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.log("inside 404 user not found");
        showErrorToast("User not found.");
      } else if (err.response && err.response.status === 400) {
        console.log("inside 400 user Email required");
        showErrorToast("Email is required.");
      } else {
        console.log("error in calling forgot password api", err);
        showErrorToast("Error sending password reset email.");
      }
    } finally {
      console.log("finally work");
      setLoading(false);
    }
  };

  return { forgotPassword, loading, response, setResponse };
};

export default useForgotPassword;

function handleInputErrors(email) {
  if (!email) {
    console.log("showing toast in hook validation");
    showErrorToast("Email is Required");
    return false;
  } else if (!isValidEmail(email)) {
    console.log("showing toast in hook invalid email");
    showErrorToast("Invalid Email Format");
    return false;
  }

  return true;
}
