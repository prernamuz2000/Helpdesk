import React, { useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, MenuItem, Select, FormControl, TextField, Grid } from '@mui/material';

const handlePriorityChange = (e, id, setRowsData) => {
  const newPriority = e.target.value;
  setRowsData((prevRows) =>
    prevRows.map((row) => (row.id === id ? { ...row, priority: newPriority } : row))
  );
  console.log(`Priority for ticket ${id} changed to ${newPriority}`);
};

const columns = (setRowsData) => [
  { field: 'id', headerName: 'Ticket Id', width: 150, sortable: true },
  { field: 'subject', headerName: 'Subject', width: 200, sortable: true },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 150,
    sortable: true,
    renderCell: (params) => (
      <FormControl fullWidth>
        <Select
          value={params.value}
          onChange={(e) => handlePriorityChange(e, params.row.id, setRowsData)}
          label="Priority"
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>
    ),
  },
  { field: 'status', headerName: 'Status', width: 150, sortable: true },
  { field: 'requestDate', headerName: 'Request Date', width: 150, sortable: true },
];

const initialRows = [
  { id: 1, subject: 'Issue with login', priority: 'High', status: 'Open', requestDate: '2024-07-30' },
  { id: 2, subject: 'Page load time', priority: 'Medium', status: 'In Progress', requestDate: '2024-07-28' },
  { id: 3, subject: 'Error 404', priority: 'Low', status: 'Closed', requestDate: '2024-07-27' },
  // Add more rows as needed
];

const filterRows = (rows, filters) => {
  const startDate = filters.startDate ? new Date(filters.startDate) : null;
  const endDate = filters.endDate ? new Date(filters.endDate) : null;

  return rows.filter((row) => {
    const requestDate = new Date(row.requestDate);
    return (
      (!filters.ticketCode || row.id.toString().includes(filters.ticketCode)) &&
      (!filters.status || (row.status || '').toLowerCase().includes(filters.status.toLowerCase())) &&
      (!filters.priority || (row.priority || '').toLowerCase().includes(filters.priority.toLowerCase())) &&
      (!startDate || requestDate >= startDate) &&
      (!endDate || requestDate <= endDate)
    );
  });
};

const TicketDetailsApi = () => {
  const [filters, setFilters] = useState({
    ticketCode: '',
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const [rowsData, setRowsData] = useState(initialRows);
  const filteredRows = useMemo(() => filterRows(rowsData, filters), [rowsData, filters]);
  const [pageSize, setPageSize] = useState(5);

  return (
    <Box sx={{ padding: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter Ticket Code"
            name="ticketCode"
            value={filters.ticketCode}
            onChange={handleFilterChange}
            sx={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
            <Select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            label="Start Date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            variant="outlined"
            type="date"
            label="End Date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ backgroundColor: '#f5f5f5', borderRadius: '5px' }}
          />
        </Grid>
      </Grid>
      <Box sx={{ height: 400, width: '100%', marginTop: 4 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns(setRowsData)}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 20]}
          pagination
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          sortingOrder={['asc', 'desc']}
          disableColumnResize
          sx={{
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#0B2B47",
              color: "#fff",
              borderBottom: '1px solid #fff',
            },
            "& .MuiDataGrid-cell": {
              color: "#0B2B47",
              borderBottom: '1px solid #e0e0e0',
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f5f5f5",
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#f5f5f5",
              borderTop: '1px solid #e0e0e0',
            },
            "& .MuiDataGrid-sortIcon": {
              color: "#fff !important",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TicketDetailsApi;
