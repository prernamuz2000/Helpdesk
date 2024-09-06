import React, { useEffect, useState } from 'react';
import Layout from '../header/Layout';
import 'bootstrap/dist/css/bootstrap.css';
import { Typography, Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';

const AdminAllowance = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { 
    const fetchData = async () => {
      try {
        setLoading(true);
       /* const response = await fetch('/api/allowancetickets'); // Ensure this URL is correct
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched data:', data); */// Debug: Check the fetched data
        const data=[];
        setRows(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const columns = [
    { field: 'srno', headerName: 'Serial No', width: 100, align: 'center', headerAlign: 'center' },
    { field: 'UserName', headerName: 'User Name', width: 150, align: 'center', headerAlign: 'center' },
    { field: 'AllowanceType', headerName: 'Allowance Type', width: 200, align: 'center', headerAlign: 'center' },
    { field: 'AllowanceAmount', headerName: 'Allowance Amount', width: 200, align: 'center', headerAlign: 'center' },
    { field: 'Status', headerName: 'Status', width: 200, align: 'center', headerAlign: 'center' },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => handleEditAllowance(params.row.id)}
          sx={{ color: "#0B2B47" }}
        >
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const handleEditAllowance = (id) => {
    // Implement the edit functionality here
    console.log('Edit allowance with id:', id);
  };

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 20px',
          borderBottom: '2px solid #ddd',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
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
                marginBottom: '0',
              }}
            >
              Allowance Tickets
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
              '& .MuiDataGrid-columnHeader': {
                backgroundColor: '#0B2B47',
                color: '#fff',
              },
              '& .MuiDataGrid-cell': {
                color: '#0B2B47',
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

export default AdminAllowance;
