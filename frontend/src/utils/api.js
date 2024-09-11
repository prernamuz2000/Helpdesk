import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/', // Replace with your backend URL
  timeout: 10000, // Optional: Set a timeout for requests
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const { user } = useAuth();
    const token = user.token;
    // If the token exists, include it in the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Optionally, add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle response error (e.g., token expiration)
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized, handle accordingly
      console.error('Error in api utils: Unauthorized or token expired. Please login again.');
      // Optionally, redirect to login or refresh token
    }

    return Promise.reject(error);
  }
);

export default api;
