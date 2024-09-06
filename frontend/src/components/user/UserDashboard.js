import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { BarChart as BarChartIcon } from "@mui/icons-material";
import Layout from "../header/Layout";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Ensure this hook provides user context
import { useHandleMiddlewareError } from "../../hooks/useHandleMiddlewareError";
import { showErrorToast } from "../../utils/toastUtils";

const UserDashboard = () => {
  const handleMiddlewareError = useHandleMiddlewareError();
  const { user } = useAuth(); // Get the user object from context
  const [statusCounts, setStatusCounts] = useState({
    Resolved: 0,
    "On hold": 0,
    Open: 0,
    Ongoing: 0,
    Unassigned: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = user?.userId; // Ensure this is the correct ID field

  console.log("user in UserDashboard", user);

  useEffect(() => {
    if (userId) {
      console.log("calling api");

      const fetchStatusCounts = async () => {
        try {
          setLoading(true);
          console.log("Fetching status counts for user:", userId);

          const response = await axios.get("http://localhost:3001/empstatus", {
            params: { userId: userId },
            headers: {
              Authorization: `Bearer ${user.token}`, // Include the token in the Authorization header
            }, // Ensure userId is passed here
          });

          console.log("API Response: user Dashboard", response.data);

          if (response.data && response.data.success && response.data.counts) {
            const { counts } = response.data;
            console.log("Fetched counts:", counts);
            setStatusCounts(counts);
          } else {
            throw new Error("Invalid response structure");
          }
        } catch (error) {
          if (!handleMiddlewareError(error)) {
            showErrorToast("Error Fetching Data");
          }
          console.error("Failed to fetch status counts:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchStatusCounts();
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return (
      <Typography
        variant="h2"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        Loading...
      </Typography>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  return (
    <Layout>
      <Box sx={{ float: "right" }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#0B2B47",
            color: "white",
            "&:hover": {
              backgroundColor: "#0B2B47",
            },
          }}
        >
          <Link
            to="/createTicket"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Add Ticket
          </Link>
        </Button>
        <Button
          sx={{
            bgcolor: "#0B2B47",
            color: "#fff",
            "&:hover": { bgcolor: "#0B2B47", color: "#fff" },
            width: "200px",
            height: "40px",
            margin: "20px",
            padding: "10px",
          }}
        >
          <Link
            to="/allowance"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Allowance Request
          </Link>
        </Button>
      </Box>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {Object.entries(statusCounts).map(([title, count], index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  textAlign: "center",
                  transition:
                    "transform 0.3s ease-in-out, background-color 0.3s ease-in-out, color 0.3s ease-in-out",
                  "&:hover": {
                    bgcolor: "#0B2B47",
                    color: "#fff",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    "&:hover *": {
                      color: "#fff",
                      transition: "color 0.3s ease-in-out",
                    },
                  }}
                >
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      color: "inherit",
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: "inherit" }}
                  >
                    {count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* <Box mt={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's trends
              </Typography>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={200}
              >
                <BarChartIcon sx={{ fontSize: 100, color: "gray" }} />
              </Box>
              <Typography variant="body2" color="textSecondary" align="center">
                No data!
              </Typography>
            </CardContent>
          </Card>
        </Box> */}
      </Container>
    </Layout>
  );
};

export default UserDashboard;
