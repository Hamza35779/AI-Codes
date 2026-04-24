const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  warehouseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  reserved: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  reorderPoint: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'inventory',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['warehouseId', 'productId'],
    },
  ],
});

module.exports = Inventory;
