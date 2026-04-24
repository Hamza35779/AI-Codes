const { Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

// Import all models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Customer = require('./Customer')(sequelize, Sequelize.DataTypes);
const Product = require('./Product')(sequelize, Sequelize.DataTypes);
const Inventory = require('./Inventory')(sequelize, Sequelize.DataTypes);
const Order = require('./Order')(sequelize, Sequelize.DataTypes);
const OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);
const Payment = require('./Payment')(sequelize, Sequelize.DataTypes);
const LoyaltyTransaction = require('./LoyaltyTransaction')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Customer, { foreignKey: 'userId' });
Customer.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Inventory, { foreignKey: 'productId' });
Inventory.belongsTo(Product, { foreignKey: 'productId' });

Customer.hasMany(Order, { foreignKey: 'customerId' });
Order.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId' });

// Payment associations
Customer.hasMany(Payment, { foreignKey: 'customerId' });
Payment.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(Payment, { foreignKey: 'orderId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });

// Loyalty associations
Customer.hasMany(LoyaltyTransaction, { foreignKey: 'customerId' });
LoyaltyTransaction.belongsTo(Customer, { foreignKey: 'customerId' });

Order.hasMany(LoyaltyTransaction, { foreignKey: 'orderId' });
LoyaltyTransaction.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = {
  sequelize,
  User,
  Customer,
  Product,
  Inventory,
  Order,
  OrderItem,
  Payment,
  LoyaltyTransaction
};
