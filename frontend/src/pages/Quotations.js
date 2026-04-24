import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Alert, Button, Chip
} from '@mui/material';
import { Add, Visibility, Download } from '@mui/icons-material';
import { formatPKR } from '../utils/currency';

const Quotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setQuotations([
        {
          id: 1, quotationNumber: 'QT-2024-001', customer: 'ABC Construction',
          date: '2024-04-15', validUntil: '2024-05-15',
          subtotal: 450000, gstAmount: 76500, total: 526500,
          status: 'sent'
        },
        {
          id: 2, quotationNumber: 'QT-2024-002', customer: 'XYZ Builders',
          date: '2024-04-18', validUntil: '2024-05-18',
          subtotal: 780000, gstAmount: 132600, total: 912600,
          status: 'accepted'
        },
        {
          id: 3, quotationNumber: 'QT-2024-003', customer: 'John Contractors',
          date: '2024-04-20', validUntil: '2024-05-20',
          subtotal: 320000, gstAmount: 54400, total: 374400,
          status: 'draft'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { 'draft': 'default', 'sent': 'info', 'accepted': 'success', 'rejected': 'error', 'expired': 'warning' };
    return colors[status] || 'default';
  };

  const handleDownload = (quotationId) => {
    alert(`Downloading quotation ${quotationId} as PDF...`);
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
        <Typography variant="h4">Quotations</Typography>
        <Button variant="contained" color="primary" startIcon={<Add />}>
          Create Quotation
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Quotation #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Valid Until</TableCell>
              <TableCell align="right">Subtotal (PKR)</TableCell>
              <TableCell align="right">GST</TableCell>
              <TableCell align="right">Total (PKR)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotations.map((quotation) => (
              <TableRow key={quotation.id}>
                <TableCell>{quotation.quotationNumber}</TableCell>
                <TableCell>{quotation.customer}</TableCell>
                <TableCell>{quotation.date}</TableCell>
                <TableCell>{quotation.validUntil}</TableCell>
                <TableCell align="right">{formatPKR(quotation.subtotal)}</TableCell>
                <TableCell align="right">{formatPKR(quotation.gstAmount)}</TableCell>
                <TableCell align="right"><strong>{formatPKR(quotation.total)}</strong></TableCell>
                <TableCell>
                  <Chip 
                    label={quotation.status} 
                    color={getStatusColor(quotation.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" startIcon={<Visibility />} href={`/quotations/${quotation.id}`}>
                    View
                  </Button>
                  <Button size="small" startIcon={<Download />} onClick={() => handleDownload(quotation.id)}>
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

export default Quotations;
