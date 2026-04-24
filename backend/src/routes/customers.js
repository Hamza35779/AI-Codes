const express = require('express');
const { Customer, Sequelize } = require('../models');
const { Op } = Sequelize;

const router = express.Router();

// Get all customers
router.get('/', async (req, res, next) => {
  try {
    const { search, isActive } = req.query;
    const where = {};
    
    if (search) {
      where[Op.or] = [
        { companyName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    const customers = await Customer.findAll({
      where,
      order: [['companyName', 'ASC']]
    });

    res.json({ customers });
  } catch (error) {
    next(error);
  }
});

// Get single customer
router.get('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: [{
        model: Order,
        attributes: ['id', 'orderNumber', 'totalAmount', 'status'],
        limit: 10,
        order: [['orderDate', 'DESC']]
      }]
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({ customer });
  } catch (error) {
    next(error);
  }
});

// Create new customer
router.post('/', async (req, res, next) => {
  try {
    const { companyName, email, phone, address, creditLimit, paymentTerms } = req.body;

    const customer = await Customer.create({
      companyName,
      email,
      phone,
      address,
      creditLimit: creditLimit || 0,
      paymentTerms: paymentTerms || 'net-30'
    });

    res.status(201).json({ customer });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(error);
  }
});

// Update customer
router.put('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.update(req.body);
    res.json({ customer });
  } catch (error) {
    next(error);
  }
});

// Deactivate customer
router.delete('/:id', async (req, res, next) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await customer.update({ isActive: false });
    res.json({ message: 'Customer deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
