import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Alert, Button, Chip, 
  IconButton, Tooltip
} from '@mui/material';
import { Edit, Visibility } from '@mui/icons-material';
import { formatPKR } from '../utils/currency';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setCustomers([
        { 
          id: 1, companyName: 'ABC Construction', email: 'contact@abcconstruction.com', 
          phone: '0300-1234567', ntn: '1234567-8', gstNumber: '1234567-8-9',
          businessType: 'contractor', creditLimit: 500000, paymentTerms: 'net-30', 
          city: 'Lahore', status: 'active' 
        },
        { 
          id: 2, companyName: 'XYZ Builders', email: 'orders@xyzbuilders.com', 
          phone: '021-34567890', ntn: '7654321-0', gstNumber: '7654321-0-1',
          businessType: 'contractor', creditLimit: 1000000, paymentTerms: 'net-60', 
          city: 'Karachi', status: 'active' 
        },
        { 
          id: 3, companyName: 'John Contractors', email: 'info@johncontractors.com', 
          phone: '051-9876543', ntn: '', gstNumber: '',
          businessType: 'individual', creditLimit: 300000, paymentTerms: 'cash', 
          city: 'Islamabad', status: 'inactive' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getBusinessTypeColor = (type) => {
    const colors = {
      'retailer': 'primary', 'wholesaler': 'secondary', 'contractor': 'success',
      'corporate': 'warning', 'individual': 'default'
    };
    return colors[type] || 'default';
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Customers</Typography>
        <Button variant="contained" color="primary" href="/customers/new">
          Add New Customer
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>NTN / GST</TableCell>
              <TableCell>Business Type</TableCell>
              <TableCell align="right">Credit Limit (PKR)</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <Typography variant="subtitle2">{customer.companyName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {customer.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{customer.phone}</Typography>
                </TableCell>
                <TableCell>
                  {customer.ntn && (
                    <Typography variant="caption" display="block">
                      NTN: {customer.ntn}
                    </Typography>
                  )}
                  {customer.gstNumber && (
                    <Typography variant="caption" display="block">
                      GST: {customer.gstNumber}
                    </Typography>
                  )}
                  {!customer.ntn && !customer.gstNumber && (
                    <Typography variant="caption" color="text.secondary">
                      Not registered
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={customer.businessType} 
                    color={getBusinessTypeColor(customer.businessType)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">{formatPKR(customer.creditLimit)}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>
                  <Chip 
                    label={customer.status} 
                    color={customer.status === 'active' ? 'success' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small" href={`/customers/${customer.id}`}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton size="small" href={`/customers/${customer.id}/edit`}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Customers;
