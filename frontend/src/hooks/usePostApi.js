import axios from "axios";
import React, { useState } from "react";

const usePostApi = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = async (url, body, headers = {}) => {
    setLoading(true);
    try {
      const response = await axios.post(url, body, { headers });
      setResponse(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err);
      setResponse(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { postData, response, error, loading };
};

export default usePostApi;
