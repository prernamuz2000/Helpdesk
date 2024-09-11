import React, { useState, useEffect } from "react";
import Layout from "../header/Layout";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { showErrorToast } from "../../utils/toastUtils";
import { useHandleMiddlewareError } from "../../hooks/useHandleMiddlewareError";
import { Button, Typography, Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const AllowanceApprove = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [actionType, setActionType] = useState('');
  const { user } = useAuth();

  const handleMiddlewareError = useHandleMiddlewareError();

  useEffect(() => {
    const fetchAllowances = async () => {
      try {
        if (!user.email) {
          throw new Error("User email is not defined");
        }

        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/allowances/${encodeURIComponent(user.email)}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const allowancesWithId = response.data.allowances.map((allowance) => ({
          ...allowance,
          id: allowance._id,
          fileinfo: allowance.fileInfo ? allowance.fileInfo : null,
        }));
        setRows(allowancesWithId);
      } catch (error) {
        console.error("Error fetching allowances:", error);

        if (!handleMiddlewareError(error)) {
          if (error?.response && error?.response.status === 404) {
            showErrorToast("No allowances found");
          } else {
            showErrorToast("An error occurred while fetching allowances.");
          }
        }
      }
    };

    fetchAllowances();
  }, [user.email]);

  const handleApprove = (id) => {
    setSelectedId(id);
    setActionType('Accept');
    setOpen(true);
  };

  const handleReject = (id) => {
    setSelectedId(id);
    setActionType('Reject');
    setOpen(true);
  };

  const handleConfirm = async () => {
    try {
      const decision = actionType === 'Accept' ? 'Accepted' : 'Rejected';
      await axios.put(`${process.env.REACT_APP_API_BASE_URL}/update/${selectedId}`, { decision });
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedId ? { ...row, status: decision } : row
        )
      );
      setOpen(false);
    } catch (error) {
      console.error(`Error ${actionType.toLowerCase()}ing allowance:`, error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = [
    { field: 'allowanceticket', headerName: 'ID', width: 78, align: "center", headerAlign: "center" },
    { field: 'date', headerName: 'Date', width: 150, align: "center", headerAlign: "center" },
    { field: 'category', headerName: 'Category', width: 170, align: "center", headerAlign: "center" },
    { field: 'description', headerName: 'Description', width: 350, align: "center", headerAlign: "center" },
    { field: 'amount', headerName: 'Amount', width: 100, align: "center", headerAlign: "center" },
    {
      field: 'file',
      headerName: 'Upload File',
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Button
          variant="text"
          onClick={() => {
            const fileUrl = params.row.fileinfo?.url;
            if (fileUrl) {
              const backendUrl = `${process.env.REACT_APP_API_BASE_URL}${fileUrl}`;
              window.open(backendUrl, "_blank");
            }
          }}
          disabled={!params.row.fileinfo?.url}
        >
          {params.row.fileinfo?.filename || "No file uploaded"}
        </Button>
      )
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   width: 250,
    //   renderCell: (params) => {
    //     const status = params.row.status;
    //     const isAccepted = status === 'Accepted';
    //     const isRejected = status === 'Rejected';

    //     return (
    //       <>
    //         {!isAccepted && !isRejected && (
    //           <>
    //             <Button
    //               variant="contained"
    //               onClick={() => handleApprove(params.row.id)}
    //               sx={{
    //                 backgroundColor: "#0B2B47",
    //                 color: "#fff",
    //                 "&:hover": {
    //                   backgroundColor: "#0B2B47",
    //                 },
    //                 marginRight: 1,
    //                 textTransform: "capitalize",
    //               }}
    //             >
    //               Approve
    //             </Button>
    //             <Button
    //               variant="contained"
    //               onClick={() => handleReject(params.row.id)}
    //               sx={{
    //                 backgroundColor: "#B71C1C",
    //                 color: "#fff",
    //                 "&:hover": {
    //                   backgroundColor: "#B71C1C",
    //                 },
    //                 textTransform: "capitalize",
    //               }}
    //             >
    //               Reject
    //             </Button>
    //           </>
    //         )}
    //         {isAccepted && (
    //           <Button
    //             variant="contained"
    //             sx={{
    //               backgroundColor: "#0B2B47",
    //               color: "#fff",
    //               "&:hover": {
    //                 backgroundColor: "#0B2B47",
    //               },
    //               textTransform: "capitalize",
    //               border: "2px solid #0B2B47",
    //             }}
    //             disabled
    //           >
    //             Approved
    //           </Button>
    //         )}
    //         {isRejected && (
    //           <Button
    //             variant="contained"
    //             sx={{
    //               backgroundColor: "#B71C1C",
    //               color: "#fff",
    //               "&:hover": {
    //                 backgroundColor: "#B71C1C",
    //               },
    //               textTransform: "capitalize",
    //               border: "2px solid #B71C1C",
    //             }}
    //             disabled
    //           >
    //             Rejected
    //           </Button>
    //         )}
    //       </>
    //     );
    //   },
    // },

    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => {
        const status = params.row.status;
        const isAccepted = status === 'Accepted';
        const isRejected = status === 'Rejected';

        return (
          <>
            {!isAccepted && !isRejected && (
              <>
                <Button
                  variant="contained"
                  onClick={() => handleApprove(params.row.id)}
                  sx={{
                    backgroundColor: "#0B2B47",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#0B2B47",
                    },
                    marginRight: 1,
                    textTransform: "capitalize",
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleReject(params.row.id)}
                  sx={{
                    backgroundColor: "#B71C1C",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#B71C1C",
                    },
                    textTransform: "capitalize",
                  }}
                >
                  Reject
                </Button>
              </>
            )}
            {isAccepted && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#388E3C", // Blue color when approved
                  color: "#fff",
                  textTransform: "capitalize",
                  "&:hover": { bgcolor: "#388E3C", color: "#fff" },

                }}


              >
                Approved
              </Button>
            )}
            {isRejected && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#D32F2F", // Red color when rejected
                  color: "#fff",
                  textTransform: "capitalize",
                  border: "2px solid #D32F2F",
                  "&:hover": { bgcolor: "#D32F2F/adminAllowance", color: "#fff" },

                }}

              >
                Rejected
              </Button>
            )}
          </>
        );
      },
    }

  ];

  return (
    <Layout>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="h5" align="center" sx={{ padding: 1 }}>
          Allowance Approval
        </Typography>
      </Box>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          disableColumnResize
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
            "& .MuiDataGrid-sortIcon": {
              color: "#fff !important",
            },
          }}
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType === 'Accept' ? 'approve' : 'reject'} this allowance?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color={actionType === 'Accept' ? 'success' : 'error'}
          >
            {actionType === 'Accept' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default AllowanceApprove;
