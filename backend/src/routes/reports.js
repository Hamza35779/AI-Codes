const express = require('express');
const { Order, OrderItem, Product, Customer, sequelize } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Sales report
router.get('/sales', async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    
    const where = {};
    if (startDate && endDate) {
      where.orderDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }
    
    const sales = await Order.findAll({
      where: { ...where, status: ['approved', 'shipped', 'delivered'] },
      include: [{
        model: OrderItem,
        include: [Product]
      }],
      order: [['orderDate', 'ASC']]
    });

    // Calculate totals
    const totalRevenue = sales.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
    const totalGST = sales.reduce((sum, order) => sum + parseFloat(order.gstAmount || 0), 0);
    const totalOrders = sales.length;

    res.json({
      summary: {
        totalRevenue,
        totalGST,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      },
      orders: sales
    });
  } catch (error) {
    next(error);
  }
});

// GST report for FBR
router.get('/gst', async (req, res, next) => {
  try {
    const { month, year } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const orders = await Order.findAll({
      where: {
        orderDate: { [Op.between]: [startDate, endDate] },
        status: ['approved', 'shipped', 'delivered']
      },
      include: [{
        model: OrderItem,
        include: [Product]
      }]
    });

    const gstSummary = {
      totalSales: 0,
      totalGST: 0,
      standardRated: { sales: 0, gst: 0 },
      exempt: { sales: 0, gst: 0 }
    };

    orders.forEach(order => {
      gstSummary.totalSales += parseFloat(order.subtotal);
      gstSummary.totalGST += parseFloat(order.gstAmount || 0);
    });

    res.json({
      period: `${month}/${year}`,
      gstSummary,
      orders: orders.length
    });
  } catch (error) {
    next(error);
  }
});

// Inventory report
router.get('/inventory', async (req, res, next) => {
  try {
    const { lowStock } = req.query;
    
    const where = {};
    if (lowStock === 'true') {
      where.quantity = { [Op.lte]: sequelize.col('reorderPoint') };
    }

    const inventory = await Inventory.findAll({
      where,
      include: [{
        model: Product,
        attributes: ['sku', 'name', 'category', 'price']
      }]
    });

    const totalValue = inventory.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) * parseFloat(item.Product.price));
    }, 0);

    res.json({
      inventory,
      summary: {
        totalItems: inventory.length,
        totalValue,
        lowStockItems: inventory.filter(i => i.quantity <= i.reorderPoint).length
      }
    });
  } catch (error) {
    next(error);
  }
});

// Top customers
router.get('/top-customers', async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const customers = await Customer.findAll({
      include: [{
        model: Order,
        attributes: [],
        where: { status: ['approved', 'shipped', 'delivered'] }
      }],
      order: [[sequelize.literal('(SELECT SUM("totalAmount") FROM "Orders" WHERE "Orders"."customerId" = "Customer"."id")'), 'DESC']],
      limit: parseInt(limit)
    });

    res.json({ topCustomers: customers });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
