import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Button, Chip, Divider } from '@mui/material';
import { formatPKR } from '../utils/currency';

const Home = () => {
  const stats = {
    totalProducts: 1250,
    activeCustomers: 345,
    pendingOrders: 28,
    monthlyRevenue: 15750000
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome to Hardware Store Pvt Ltd
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Pakistan's Premier Wholesale Hardware Platform
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">₨{stats.totalProducts.toLocaleString()}</Typography>
              <Typography color="text.secondary">Products in Catalog</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="primary">{stats.activeCustomers}</Typography>
              <Typography color="text.secondary">Active Customers</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="warning.main">{stats.pendingOrders}</Typography>
              <Typography color="text.secondary">Pending Orders</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" color="success.main">{formatPKR(stats.monthlyRevenue)}</Typography>
              <Typography color="text.secondary">Monthly Revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Product Catalog</Typography>
              <Typography color="text.secondary" paragraph>
                Browse {stats.totalProducts.toLocaleString()}+ hardware products with wholesale pricing in PKR
              </Typography>
              <Button component={Link} to="/products" variant="contained" fullWidth>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Place Bulk Orders</Typography>
              <Typography color="text.secondary" paragraph>
                Order in bulk with multiple payment options: JazzCash, Easypaisa, Bank Transfer
              </Typography>
              <Button component={Link} to="/orders" variant="contained" fullWidth>
                View Orders
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Manage Customers</Typography>
              <Typography color="text.secondary" paragraph>
                B2B accounts with NTN/GST tracking and credit limits
              </Typography>
              <Button component={Link} to="/customers" variant="contained" fullWidth>
                Manage Customers
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>Payment Methods Available</Typography>
      <Grid container spacing={2}>
        {['JazzCash', 'Easypaisa', 'Bank Transfer', 'Cash on Delivery', 'Cheque', 'Cash'].map((method) => (
          <Grid item key={method}>
            <Chip label={method} color="primary" variant="outlined" />
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Serving hardware businesses across Pakistan: Lahore • Karachi • Islamabad • Faisalabad • Peshawar • Quetta
        </Typography>
        <Typography variant="caption" color="text.secondary">
          All prices in Pakistani Rupee (PKR) | 17% GST applicable | Registered under Sales Tax Act 1990
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
