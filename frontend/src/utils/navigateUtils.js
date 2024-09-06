import { useNavigate } from 'react-router-dom';

// Utility function to navigate to a specific route
export const useNavigateTo = (path) => {
  const navigate = useNavigate();

  const navigateTo = () => {
    navigate(path); // Navigate to the specified path
  };

  return navigateTo;
};

// Define specific navigation functions
export const useNavigateToLogin = () => useNavigateTo('/login');
export const useNavigateToSignUp = () => useNavigateTo('/signup');