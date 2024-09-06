import axios from "axios";
import React, { useState } from "react";

const useGetApi = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getData = async (url) => {
    setLoading(true);

    try {
      const response = await axios.get(url);
      setResponse(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      setResponse(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return { getData, response, error, loading };
};

export default useGetApi;
