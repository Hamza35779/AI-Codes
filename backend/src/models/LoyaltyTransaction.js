const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LoyaltyTransaction = sequelize.define('LoyaltyTransaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.UUID,
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Positive for earned, negative for redeemed'
  },
  balance: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Running balance after this transaction'
  },
  type: {
    type: DataTypes.ENUM,
    values: ['earned', 'redeemed', 'adjusted', 'expired'],
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  expiryDate: {
    type: DataTypes.DATE,
  },
}, {
  tableName: 'loyalty_transactions',
  timestamps: true,
  indexes: [
    { fields: ['customerId'] },
    { fields: ['orderId'] }
  ]
});

module.exports = LoyaltyTransaction;
