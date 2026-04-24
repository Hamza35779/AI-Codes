import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, TextField, Button, Select,
  MenuItem, FormControl, InputLabel, CircularProgress, Alert, CardActions
} from '@mui/material';
import { formatPKR } from '../utils/currency';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setProducts([
        {
          id: 1, sku: 'HAM-001', name: 'Claw Hammer 16oz', 
          description: 'Professional claw hammer with fiberglass handle',
          category: 'Hand Tools', price: 1999.99, unit: 'each', 
          stock: 500, minOrder: 10, gstRate: 17
        },
        {
          id: 2, sku: 'SAW-002', name: 'Circular Saw 7-1/4"', 
          description: 'Cordless circular saw with laser guide',
          category: 'Power Tools', price: 49999.99, unit: 'each', 
          stock: 200, minOrder: 5, gstRate: 17
        },
        {
          id: 3, sku: 'DRL-003', name: 'Cordless Drill 18V', 
          description: '18V lithium-ion cordless drill with 2 batteries',
          category: 'Power Tools', price: 34999.99, unit: 'each', 
          stock: 300, minOrder: 3, gstRate: 17
        }
      ]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || product.category === filters.category;
    return matchesSearch && matchesCategory;
  });

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
        Product Catalog
      </Typography>
      
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth label="Search Products" variant="outlined" size="small"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by name or description..."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category" value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Hand Tools">Hand Tools</MenuItem>
                <MenuItem value="Power Tools">Power Tools</MenuItem>
                <MenuItem value="Safety Equipment">Safety Equipment</MenuItem>
                <MenuItem value="Building Materials">Building Materials</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  SKU: {product.sku}
                </Typography>
                <Typography color="text.secondary" paragraph sx={{ fontSize: '0.875rem' }}>
                  {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Category: {product.category}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mt: 1, mb: 1 }}>
                  {formatPKR(product.price)}
                  <Typography variant="caption" color="text.secondary"> + GST</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  In Stock: {product.stock} {product.unit}s | Min Order: {product.minOrder}
                </Typography>
              </CardContent>
              <CardActions>
                <Button component={Link} to={`/products/${product.id}`} variant="outlined" size="small" fullWidth>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Products;
