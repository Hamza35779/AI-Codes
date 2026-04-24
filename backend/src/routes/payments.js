const express = require('express');
const { Order, Payment, Customer } = require('../models');
const { JazzCashConfig, EasypaisaConfig, BankTransferConfig, currencySymbol } = require('../config/payment');

const router = express.Router();

// Get available payment methods
router.get('/methods', async (req, res, next) => {
  try {
    const methods = [
      { 
        id: 'cash', 
        name: 'Cash', 
        enabled: true,
        description: 'Pay in cash at our store or upon delivery'
      },
      { 
        id: 'cod', 
        name: 'Cash on Delivery', 
        enabled: CODConfig.enabled,
        description: `Pay cash upon delivery (Max: ${currencySymbol}${CODConfig.maxAmount})`,
        maxAmount: CODConfig.maxAmount
      },
      { 
        id: 'bank_transfer', 
        name: 'Bank Transfer (IBFT)', 
        enabled: BankTransferConfig.enabled,
        description: 'Transfer via online banking or mobile app',
        accounts: BankTransferConfig.bankAccounts
      },
      { 
        id: 'jazzcash', 
        name: 'JazzCash', 
        enabled: JazzCashConfig.enabled,
        description: 'Pay via JazzCash mobile account'
      },
      { 
        id: 'easypaisa', 
        name: 'Easypaisa', 
        enabled: EasypaisaConfig.enabled,
        description: 'Pay via Easypaisa mobile account'
      },
      { 
        id: 'cheque', 
        name: 'Cheque', 
        enabled: true,
        description: 'Pay via bank cheque (clearance takes 2-3 working days)'
      }
    ];
    
    res.json({ methods });
  } catch (error) {
    next(error);
  }
});

// Initiate JazzCash payment
router.post('/jazzcash/initiate', async (req, res, next) => {
  try {
    const { orderId, phoneNumber } = req.body;
    
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // JazzCash API integration would go here
    // For now, return payment instructions
    res.json({
      message: 'JazzCash payment initiated',
      instructions: `Send ${currencySymbol}${order.totalAmount} to JazzCash Number: 0300-1234567`,
      transactionId: `JC-${Date.now()}`,
      paymentMethod: 'jazzcash'
    });
  } catch (error) {
    next(error);
  }
});

// JazzCash callback
router.post('/jazzcash/callback', async (req, res, next) => {
  try {
    const { pp_TxnRefNo, pp_Amount, pp_TxnStatus } = req.body;
    
    if (pp_TxnStatus === '000') {
      // Payment successful
      await Payment.create({
        orderId: req.body.orderId,
        paymentMethod: 'jazzcash',
        amount: pp_Amount / 100, // JazzCash sends amount in paisa
        transactionId: pp_TxnRefNo,
        status: 'completed'
      });
      
      res.json({ message: 'Payment successful' });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    next(error);
  }
});

// Initiate Easypaisa payment
router.post('/easypaisa/initiate', async (req, res, next) => {
  try {
    const { orderId, phoneNumber } = req.body;
    
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Easypaisa payment initiated',
      instructions: `Send ${currencySymbol}${order.totalAmount} to Easypaisa Account: 0300-7654321`,
      transactionId: `EP-${Date.now()}`,
      paymentMethod: 'easypaisa'
    });
  } catch (error) {
    next(error);
  }
});

// Record bank transfer
router.post('/bank-transfer', async (req, res, next) => {
  try {
    const { orderId, bankName, transactionId, amount, receiptImage } = req.body;
    
    const payment = await Payment.create({
      orderId,
      paymentMethod: 'bank_transfer',
      amount,
      bankName,
      transactionId,
      receiptImage,
      status: 'pending' // Needs verification
    });

    res.status(201).json({ 
      payment,
      message: 'Bank transfer recorded. Awaiting verification.'
    });
  } catch (error) {
    next(error);
  }
});

// Record cheque payment
router.post('/cheque', async (req, res, next) => {
  try {
    const { orderId, chequeNumber, bankName, chequeDate, amount } = req.body;
    
    const payment = await Payment.create({
      orderId,
      paymentMethod: 'cheque',
      amount,
      chequeNumber,
      bankName,
      chequeDate,
      status: 'pending' // Bounces possible
    });

    res.status(201).json({ 
      payment,
      message: 'Cheque recorded. Clearing in 2-3 working days.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
