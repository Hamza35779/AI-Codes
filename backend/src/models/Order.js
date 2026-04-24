const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['draft', 'submitted', 'processing', 'approved', 'shipped', 'delivered', 'cancelled'],
    defaultValue: 'draft',
  },
  // Pakistani payment fields
  paymentMethod: {
    type: DataTypes.ENUM,
    values: ['cash', 'bank_transfer', 'jazzcash', 'easypaisa', 'cheque', 'cod'],
    defaultValue: 'cash',
  },
  paymentStatus: {
    type: DataTypes.ENUM,
    values: ['pending', 'partial', 'paid', 'refunded'],
    defaultValue: 'pending',
  },
  // Financial calculations in PKR
  subtotal: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
  },
  gstAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
    comment: 'GST amount in PKR'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  paidAmount: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0,
  },
  paymentTerms: {
    type: DataTypes.STRING,
    defaultValue: 'immediate',
  },
  // Shipping in Pakistan
  shippingAddress: {
    type: DataTypes.JSONB,
  },
  shippingCity: {
    type: DataTypes.STRING,
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  trackingNumber: {
    type: DataTypes.STRING,
  },
  courierService: {
    type: DataTypes.STRING,
    comment: 'TCS, Leopards, etc.'
  },
}, {
  tableName: 'orders',
  timestamps: true,
});

module.exports = Order;
