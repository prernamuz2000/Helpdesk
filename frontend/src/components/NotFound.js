import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";

const NotFound = () => {
    const navigate = useNavigate();
  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "50px" }}>
      <Box>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Oops! The page you are looking for does not exist.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={()=>{
            navigate('/')
          }}
          style={{ marginTop: "20px" }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
