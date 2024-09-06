import axios from "axios";
import React, { useState } from "react";

const usePutApi = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const putData = async (url, body, headers = {}) => {
    setLoading(true);
    try {
      console.log('inside put data fun',url,body,headers);  
      const response = await axios.put(url, body, { headers });
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

  return { putData, response, error, loading };
};

export default usePutApi;

//sample usage
// const {putData,response,error,loading} = usePutApi();
