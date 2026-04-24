const express = require('express');
const { Customer, LoyaltyTransaction, Order } = require('../models');

const router = express.Router();

// Get customer loyalty points
router.get('/customer/:customerId', async (req, res, next) => {
  try {
    const { customerId } = req.params;
    
    const transactions = await LoyaltyTransaction.findAll({
      where: { customerId },
      order: [['createdAt', 'DESC']]
    });

    const currentBalance = transactions.length > 0 ? transactions[0].balance : 0;

    res.json({
      currentBalance,
      transactions
    });
  } catch (error) {
    next(error);
  }
});

// Award points for order (called when order is completed)
router.post('/award', async (req, res, next) => {
  try {
    const { customerId, orderId, points } = req.body;
    
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Get current balance
    const lastTransaction = await LoyaltyTransaction.findOne({
      where: { customerId },
      order: [['createdAt', 'DESC']]
    });
    const currentBalance = lastTransaction ? lastTransaction.balance : 0;
    const newBalance = currentBalance + points;

    const transaction = await LoyaltyTransaction.create({
      customerId,
      orderId,
      points,
      balance: newBalance,
      type: 'earned',
      description: `Points earned for order ${orderId}`
    });

    res.status(201).json({ transaction, newBalance });
  } catch (error) {
    next(error);
  }
});

// Redeem points
router.post('/redeem', async (req, res, next) => {
  try {
    const { customerId, points, description } = req.body;
    
    const lastTransaction = await LoyaltyTransaction.findOne({
      where: { customerId },
      order: [['createdAt', 'DESC']]
    });
    const currentBalance = lastTransaction ? lastTransaction.balance : 0;

    if (currentBalance < points) {
      return res.status(400).json({ error: 'Insufficient points' });
    }

    const newBalance = currentBalance - points;

    const transaction = await LoyaltyTransaction.create({
      customerId,
      points: -points,
      balance: newBalance,
      type: 'redeemed',
      description: description || 'Points redeemed'
    });

    res.json({ transaction, newBalance });
  } catch (error) {
    next(error);
  }
});

// Calculate points to award (e.g., 1 point per 100 PKR spent)
router.post('/calculate', (req, res) => {
  const { amount } = req.body;
  const points = Math.floor(amount / 100); // 1 point per 100 PKR
  res.json({ points, amount, rate: '1 point per ₨100 spent' });
});

module.exports = router;
