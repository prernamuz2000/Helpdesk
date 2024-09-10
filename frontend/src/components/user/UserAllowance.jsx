import React, { useEffect, useState } from "react";
import Layout from "../header/Layout";
import "bootstrap/dist/css/bootstrap.css";
import { Typography, Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useHandleMiddlewareError } from "../../hooks/useHandleMiddlewareError";
import { showErrorToast } from "../../utils/toastUtils";

const UserAllowance = () => {
  const [allowances, setAllowances] = useState([]);
  const { user } = useAuth();


  const handleMiddlewareError = useHandleMiddlewareError();

  console.log("inside userAllowance Recheck Done");

  useEffect(() => {
    const fetchPendingAllowances = async () => {
      try {
        if (user && user.userId) {
          const response = await axios.get(
            `http://localhost:3001/allowance/${user.userId}`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`, // Bearer token for authentication
              },
            }
          );
          console.log("Fetched Allowances:", response.data);
          setAllowances(response.data || []);
        } else {
          console.error("User ID is not available");
        }
      } catch (error) {
        if (!handleMiddlewareError(error)) {
          if (error.response && error.response.status === 404) {
            showErrorToast("No allowances found");
          } else {
            showErrorToast("An error occurred while fetching allowances.");
          }

          //showErrorToast("Error Fetching Data");
        }
        console.error("Error fetching pending allowances:", error.response);
      }
    };

    fetchPendingAllowances();
  }, [user]);
  const rows = allowances.map((allowance, index) => ({
    id: allowance._id,
    srno: index + 1,
    allowanceticket: allowance.allowanceticket,
    AllowanceType: allowance.category,
    description: allowance.description,
    fileInfo: allowance.fileInfo, // Include the entire fileInfo object here
    status: allowance.status,
  }));

  const getStatusStyle = (status) => {
    if (status === "Pending") return { color: "#0B2B47", fontWeight: "bold" };
    if (status === "Accepted") return { color: "#4CAF50", fontWeight: "bold" };
    if (status === "Rejected") return { color: "#F44336", fontWeight: "bold" };
    return {};
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "0 20px",
          borderBottom: "2px solid #ddd",
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
                marginBottom: "0",
              }}
            >
              Allowance Ticket
            </Typography>
          </Box>
        </Box>
        <Box sx={{ height: 550, width: "100%" }}>
          <DataGrid
            disableColumnResize
            rows={rows}
            columns={[
              {
                field: "srno",
                headerName: "Sr No.",
                width: 60,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "allowanceticket",
                headerName: "ID",
                width: 78,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "AllowanceType",
                headerName: "Allowance Request",
                width: 164,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "description",
                headerName: "Description",
                width: 300,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "uploadedFile",
                headerName: "Uploaded File",
                width: 250,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                  const fileUrl = params.row.fileInfo?.url;
                  const filename =
                    params.row.fileInfo?.filename || "No file uploaded";
                  return (
                    <Button
                      variant="text"
                      onClick={() => {
                        if (fileUrl) {
                          const backendUrl = `http://localhost:3001${fileUrl}`;
                          window.open(backendUrl, "_blank");
                        }
                      }}
                      disabled={!fileUrl}
                    >
                      {filename}
                    </Button>
                  );
                },
              },

              {
                field: "status",
                headerName: "Status",
                width: 200,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => (
                  <span style={getStatusStyle(params.value)}>
                    {params.value}
                  </span>
                ),
              },
            ]}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            sx={{
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#0B2B47",
                color: "#fff",
              },
              "& .MuiDataGrid-cell": {
                color: "#0B2B47",
              },
              "& .MuiDataGrid-cell:focus": {
                outline: "none",
              },
            }}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default UserAllowance;
