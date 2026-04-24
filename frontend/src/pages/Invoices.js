import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Alert, Button, Chip
} from '@mui/material';
import { Download, Visibility } from '@mui/icons-material';
import { formatPKR } from '../utils/currency';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setInvoices([
        {
          id: 1, invoiceNumber: 'INV-2024-001', orderNumber: 'ORD-2024-001',
          customer: 'ABC Construction', date: '2024-04-20',
          subtotal: 129999.99, gstAmount: 22100.00, total: 152099.99,
          status: 'paid', paymentMethod: 'bank_transfer'
        },
        {
          id: 2, invoiceNumber: 'INV-2024-002', orderNumber: 'ORD-2024-002',
          customer: 'XYZ Builders', date: '2024-04-22',
          subtotal: 289999.50, gstAmount: 49299.92, total: 339299.42,
          status: 'paid', paymentMethod: 'jazzcash'
        },
        {
          id: 3, invoiceNumber: 'INV-2024-003', orderNumber: 'ORD-2024-003',
          customer: 'John Contractors', date: '2024-04-23',
          subtotal: 89975.00, gstAmount: 15295.75, total: 105270.75,
          status: 'pending', paymentMethod: 'cod'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'pending': 'warning', 'paid': 'success', 'cancelled': 'error', 'refunded': 'default' };
    return colors[status] || 'default';
  };

  const handleDownload = (invoiceId) => {
    alert(`Downloading invoice ${invoiceId} as PDF...`);
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
        <Typography variant="h4">Invoices</Typography>
        <Button variant="contained" color="primary">
          Generate New Invoice
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Subtotal (PKR)</TableCell>
              <TableCell align="right">GST</TableCell>
              <TableCell align="right">Total (PKR)</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.orderNumber}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell align="right">{formatPKR(invoice.subtotal)}</TableCell>
                <TableCell align="right">{formatPKR(invoice.gstAmount)}</TableCell>
                <TableCell align="right"><strong>{formatPKR(invoice.total)}</strong></TableCell>
                <TableCell>
                  <Chip label={invoice.paymentMethod} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={invoice.status} 
                    color={getStatusColor(invoice.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" startIcon={<Visibility />} href={`/invoices/${invoice.id}`}>
                    View
                  </Button>
                  <Button size="small" startIcon={<Download />} onClick={() => handleDownload(invoice.id)}>
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Invoices;
