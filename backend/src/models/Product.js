const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subcategory: {
    type: DataTypes.STRING,
  },
  // Pakistani business fields
  cost: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Cost in PKR'
  },
  price: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Selling price in PKR'
  },
  gstRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 17.00,
    comment: 'GST rate percentage'
  },
  unit: {
    type: DataTypes.STRING,
    defaultValue: 'each',
  },
  hscode: {
    type: DataTypes.STRING,
    comment: 'HS Code for customs'
  },
  specifications: {
    type: DataTypes.JSONB,
  },
  images: {
    type: DataTypes.JSONB,
  },
  minStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  maxStock: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
  },
}, {
  tableName: 'products',
  timestamps: true,
});

module.exports = Product;
