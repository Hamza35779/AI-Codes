import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Alert, Button, Chip, Select, MenuItem
} from '@mui/material';
import { formatPKR } from '../utils/currency';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setOrders([
        { 
          id: 1, orderNumber: 'ORD-2024-001', customer: 'ABC Construction', 
          date: '2024-04-20', status: 'processing', 
          subtotal: 129999.99, gstAmount: 22100.00, total: 152099.99,
          paymentMethod: 'bank_transfer', paymentStatus: 'pending'
        },
        { 
          id: 2, orderNumber: 'ORD-2024-002', customer: 'XYZ Builders', 
          date: '2024-04-22', status: 'submitted', 
          subtotal: 289999.50, gstAmount: 49299.92, total: 339299.42,
          paymentMethod: 'jazzcash', paymentStatus: 'completed'
        },
        { 
          id: 3, orderNumber: 'ORD-2024-003', customer: 'John Contractors', 
          date: '2024-04-23', status: 'delivered', 
          subtotal: 89975.00, gstAmount: 15295.75, total: 105270.75,
          paymentMethod: 'cod', paymentStatus: 'pending'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'draft': 'default', 'submitted': 'info', 'processing': 'warning',
      'approved': 'info', 'shipped': 'primary', 'delivered': 'success', 
      'cancelled': 'error'
    };
    return colors[status] || 'default';
  };

  const getPaymentMethodName = (method) => {
    const names = {
      'cash': 'Cash', 'bank_transfer': 'Bank Transfer', 'jazzcash': 'JazzCash',
      'easypaisa': 'Easypaisa', 'cheque': 'Cheque', 'cod': 'Cash on Delivery'
    };
    return names[method] || method;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'pending': 'warning', 'partial': 'info', 'paid': 'success', 'refunded': 'error'
    };
    return colors[status] || 'default';
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
        <Typography variant="h4">Orders</Typography>
        <Button variant="contained" color="primary" component={Link} to="/orders/new">
          Create New Order
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Subtotal (PKR)</TableCell>
              <TableCell align="right">GST</TableCell>
              <TableCell align="right">Total (PKR)</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Order Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell align="right">{formatPKR(order.subtotal)}</TableCell>
                <TableCell align="right">{formatPKR(order.gstAmount)}</TableCell>
                <TableCell align="right"><strong>{formatPKR(order.total)}</strong></TableCell>
                <TableCell>
                  <Chip label={getPaymentMethodName(order.paymentMethod)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.paymentStatus} 
                    color={getPaymentStatusColor(order.paymentStatus)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" component={Link} to={`/orders/${order.id}`}>
                    View
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

export default Orders;
