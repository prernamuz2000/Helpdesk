import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { showErrorToast } from "../utils/toastUtils";

export const useHandleMiddlewareError = () => {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Access logout from AuthContext

  const handleMiddlewareError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      const { data } = error.response;
      if (data.middlewareError) {
        showErrorToast('Session Expired');
        logout(); // Log the user out
        navigate('/login'); // Navigate to login
        return true;
      }
    }
    return false;
  };

  return handleMiddlewareError;
};
