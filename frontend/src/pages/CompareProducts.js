import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, CardContent, Button, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, IconButton, Chip, CircularProgress, Alert
} from '@mui/material';
import { Delete, CompareArrows } from '@mui/icons-material';
import { formatPKR } from '../utils/currency';

const CompareProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data for comparison
      setProducts([
        {
          id: 1, sku: 'HAM-001', name: 'Claw Hammer 16oz',
          description: 'Professional claw hammer with fiberglass handle',
          category: 'Hand Tools', price: 1999.99, gstRate: 17,
          specifications: {
            'Weight': '16 oz', 'Handle': 'Fiberglass', 'Length': '13 inches',
            'Head Material': 'Steel', 'Grip': 'Rubberized'
          },
          rating: 4.5, reviews: 128
        },
        {
          id: 2, sku: 'HAM-002', name: 'Claw Hammer 20oz',
          description: 'Heavy-duty claw hammer with wooden handle',
          category: 'Hand Tools', price: 2499.99, gstRate: 17,
          specifications: {
            'Weight': '20 oz', 'Handle': 'Hickory Wood', 'Length': '14 inches',
            'Head Material': 'Forged Steel', 'Grip': 'Textured'
          },
          rating: 4.7, reviews: 89
        },
        {
          id: 3, sku: 'HAM-003', name: 'California Framing Hammer',
          description: 'Professional framing hammer with milled face',
          category: 'Hand Tools', price: 3499.99, gstRate: 17,
          specifications: {
            'Weight': '22 oz', 'Handle': 'Steel', 'Length': '18 inches',
            'Head Material': 'Forged Steel', 'Grip': 'Anti-vibration'
          },
          rating: 4.8, reviews: 56
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="h6" gutterBottom>No Products to Compare</Typography>
        <Button variant="contained" component={Link} to="/products">
          Browse Products to Compare
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Compare Products</Typography>
        <Button variant="outlined" component={Link} to="/products">
          Add More Products
        </Button>
      </Box>

      <Grid container spacing={2}>
        {products.map(product => (
          <Grid item xs={12} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">{product.name}</Typography>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleRemove(product.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  {product.sku}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {formatPKR(product.price)}
                  <Typography variant="caption" color="text.secondary"> + GST</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Chip 
                  label={`⭐ ${product.rating} (${product.reviews} reviews)`} 
                  size="small" 
                  color="primary" 
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Specification Comparison</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Specification</TableCell>
                {products.map(p => (
                  <TableCell key={p.id} align="center">{p.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {['Weight', 'Handle', 'Length', 'Head Material', 'Grip'].map(spec => (
                <TableRow key={spec}>
                  <TableCell component="th" scope="row">{spec}</TableCell>
                  {products.map(p => (
                    <TableCell key={p.id} align="center">
                      {p.specifications[spec] || 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              <TableRow>
                <TableCell component="th" scope="row">Price (PKR)</TableCell>
                {products.map(p => (
                  <TableCell key={p.id} align="center">
                    <strong>{formatPKR(p.price)}</strong>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">GST Rate</TableCell>
                {products.map(p => (
                  <TableCell key={p.id} align="center">{p.gstRate}%</TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default CompareProducts;
