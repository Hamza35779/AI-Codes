const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  // Payment method specific to Pakistan
  paymentMethod: {
    type: DataTypes.ENUM,
    values: ['cash', 'bank_transfer', 'jazzcash', 'easypaisa', 'cheque', 'cod'],
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Amount in PKR'
  },
  // Transaction details
  transactionId: {
    type: DataTypes.STRING,
    comment: 'JazzCash/Easypaisa transaction ID'
  },
  bankName: {
    type: DataTypes.STRING,
    comment: 'For bank transfers'
  },
  chequeNumber: {
    type: DataTypes.STRING,
    comment: 'For cheque payments'
  },
  chequeDate: {
    type: DataTypes.DATE,
    comment: 'Cheque date'
  },
  // Payment status
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'completed', 'failed', 'cancelled', 'bounced'],
    defaultValue: 'pending',
  },
  paymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Verification
  verifiedBy: {
    type: DataTypes.UUID,
  },
  verificationDate: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.TEXT,
  },
  receiptImage: {
    type: DataTypes.STRING,
    comment: 'Bank deposit slip or payment proof'
  },
}, {
  tableName: 'payments',
  timestamps: true,
  indexes: [
    { fields: ['orderId'] },
    { fields: ['customerId'] },
    { fields: ['transactionId'] }
  ]
});

module.exports = Payment;
