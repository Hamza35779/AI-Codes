import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, FormControl, InputLabel, 
  Select, MenuItem, Button, Alert, CircularProgress, Tabs, Tab
} from '@mui/material';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { formatPKR } from '../utils/currency';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [salesData, setSalesData] = useState(null);
  const [gstData, setGstData] = useState(null);
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock sales data
      setSalesData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Sales (PKR)',
          data: [1250000, 1500000, 1350000, 1800000, 1650000, 1900000],
          backgroundColor: 'rgba(25, 118, 210, 0.8)',
        }]
      });

      setGstData({
        labels: ['Standard Rated', 'Zero Rated', 'Exempt'],
        datasets: [{
          data: [285000, 145000, 70000],
          backgroundColor: ['#1976d2', '#4caf50', '#ff9800'],
        }]
      });

      setTopCustomers([
        { companyName: 'ABC Construction', totalSpent: 550000, orders: 12 },
        { companyName: 'XYZ Builders', totalSpent: 420000, orders: 8 },
        { companyName: 'John Contractors', totalSpent: 310000, orders: 6 },
      ]);
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
      <Typography variant="h4" gutterBottom>
        Reports & Analytics
      </Typography>

      <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 3 }}>
        <Tab label="Sales Report" />
        <Tab label="GST Report" />
        <Tab label="Top Customers" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Monthly Sales Trend</Typography>
                {salesData && <Bar data={salesData} options={{ responsive: true }} />}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Summary</Typography>
                <Typography>Total Revenue: {formatPKR(9450000)}</Typography>
                <Typography>Total Orders: 156</Typography>
                <Typography>Avg Order Value: {formatPKR(60577)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>GST Breakdown</Typography>
                {gstData && <Pie data={gstData} />}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>GST Summary</Typography>
                <Typography>Standard Rated: {formatPKR(285000)}</Typography>
                <Typography>Zero Rated: {formatPKR(145000)}</Typography>
                <Typography>Exempt: {formatPKR(70000)}</Typography>
                <Typography variant="h6" mt={2}>Total GST: {formatPKR(500000)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Top 10 Customers</Typography>
            {topCustomers.map((customer, index) => (
              <Box key={index} display="flex" justifyContent="space-between" py={1} borderBottom="1px solid #eee">
                <Typography>{customer.companyName}</Typography>
                <Box>
                  <Typography component="span" mr={2}>{formatPKR(customer.totalSpent)}</Typography>
                  <Typography color="text.secondary">{customer.orders} orders</Typography>
                </Box>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Reports;
