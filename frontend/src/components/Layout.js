import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'white' }}>
            Hardware Store
          </Typography>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/products">Products</Button>
              <Button color="inherit" component={Link} to="/inventory">Inventory</Button>
              <Button color="inherit" component={Link} to="/orders">Orders</Button>
              <Button color="inherit" component={Link} to="/invoices">Invoices</Button>
              <Button color="inherit" component={Link} to="/reports">Reports</Button>
              <Button color="inherit" component={Link} to="/customers">Customers</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          )}
          {!user && (
            <Button color="inherit" component={Link} to="/auth/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3, width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
