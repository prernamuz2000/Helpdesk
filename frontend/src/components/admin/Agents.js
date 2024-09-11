import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import Layout from '../header/Layout';
import 'bootstrap/dist/css/bootstrap.css';
import { Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Define the columns for DataGrid without the action column
const columns = [
  { field: 'srno', headerName: 'Serial No', width: 100, align: 'center', headerAlign: 'center' },
  { field: 'AgentName', headerName: 'Agent Name', width: 560, align: 'center', headerAlign: 'center' },
  { field: 'Role', headerName: 'Role', width: 200, align: 'center', headerAlign: 'center' },
  { field: 'TotalTickets', headerName: 'Total Tickets', width: 200, align: 'center', headerAlign: 'center' },
];

const Agents = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component mounts
    const fetchAgents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_TICKET}/tickets/agents`);
        const data = response.data;

        // Transform data to match DataGrid rows format
        const transformedRows = data.map((agent, index) => ({
          id: index + 1, // Assign a unique id
          srno: index + 1,
          AgentName: agent.name,
          Role: agent.role,
          TotalTickets: agent.assignedTickets.length, // Count of open tickets
        }));

        setRows(transformedRows);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

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
    </Layout>
  );
};

export default Agents;
