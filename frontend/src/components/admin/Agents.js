import React from 'react';
import Layout from '../header/Layout';

import 'bootstrap/dist/css/bootstrap.css';
import { Typography, Box, Button, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
const rows = [
  { id: 1, srno: 1, AgentName: 'T123', Role: 'Developer', TotalTicket: 'E123' },
  { id: 2, srno: 2, AgentName: 'T124', Role: 'Designer', TotalTicket: 'E456' },
  // Add more rows as needed
];

const columns = [
  { field: 'srno', headerName: 'Serial No', width: 100, align: 'center', headerAlign: 'center' },
  { field: 'Agent Name', headerName: 'Agent Name', width: 560, align: 'center', headerAlign: 'center' },
  { field: 'Role', headerName: 'Role', width: 200, align: 'center', headerAlign: 'center' },
  { field: 'Total Tickets', headerName: 'Total Tickets', width: 200, align: 'center', headerAlign: 'center' },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
    renderCell: (params) => (
      <IconButton color="primary" onClick={() => handleEditTicket(params.row.id)}>
        <EditIcon />
      </IconButton>
    ),
  },
];

const handleEditTicket = (id) => {
  // Implement the edit functionality here
  console.log('Edit ticket with id:', id);
};
const Agents = () => {

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 20px',
          borderBottom: '2px solid #ddd',
          maxWidth: '1300px', // Max width to ensure it doesn't stretch too wide
          margin: '0 auto',  // Center the container
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px', // Space between heading and DataGrid
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: '#333',
                textAlign: 'center',
                marginBottom: '0', // Remove bottom margin
              }}
            >
              Agents
            </Typography>
          </Box>

        </Box>
        <Box sx={{ height: 550, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            disableColumnResize
            sx={{
              // Custom styles for DataGrid
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#0B2B47',
                color: '#fff', // Optional: change header text color for contrast
              },
              '& .MuiDataGrid-cell': {
                color: '#0B2B47', // Change cell text color if desired
              },
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
            }}
          />
        </Box>
      </Box>
    </Layout>)
};

export default Agents;