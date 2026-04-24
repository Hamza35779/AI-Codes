import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Alert, Chip
} from '@mui/material';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInventory([
        { id: 1, sku: 'HAM-001', name: 'Claw Hammer', warehouse: 'Main', quantity: 500, reserved: 50, available: 450, reorderPoint: 100, status: 'OK' },
        { id: 2, sku: 'SAW-002', name: 'Circular Saw', warehouse: 'Main', quantity: 200, reserved: 20, available: 180, reorderPoint: 50, status: 'OK' },
        { id: 3, sku: 'DRL-003', name: 'Cordless Drill', warehouse: 'East', quantity: 300, reserved: 75, available: 225, reorderPoint: 80, status: 'OK' }
      ]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Inventory Management</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Warehouse</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Reserved</TableCell>
              <TableCell align="right">Available</TableCell>
              <TableCell align="right">Reorder Point</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.warehouse}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.reserved}</TableCell>
                <TableCell align="right">{item.available}</TableCell>
                <TableCell align="right">{item.reorderPoint}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.available < item.reorderPoint ? 'Low Stock' : 'OK'} 
                    color={item.available < item.reorderPoint ? 'warning' : 'success'} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Inventory;
