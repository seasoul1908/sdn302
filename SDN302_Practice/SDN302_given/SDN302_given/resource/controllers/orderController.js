const mongoose = require('mongoose');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('customer_id')
      .populate('items.product_id')
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await Order.findById(id)
      .populate('customer_id')
      .populate('items.product_id');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { customer_id, items, payment_method, status, order_date } = req.body;

    // 1. Validate customer_id
    if (!customer_id || !mongoose.Types.ObjectId.isValid(customer_id)) {
      return res.status(400).json({ error: 'Valid customer_id is required' });
    }

    const customer = await Customer.findById(customer_id);
    if (!customer) {
      return res.status(400).json({ error: 'Customer not found' });
    }

    // 2. Validate payment_method and status
    if (!payment_method || typeof payment_method !== 'string' || payment_method.trim() === '') {
      return res.status(400).json({ error: 'Payment method is required' });
    }

    if (!status || typeof status !== 'string' || status.trim() === '') {
      return res.status(400).json({ error: 'Status is required' });
    }

    // 3. Validate order_date if provided
    let parsedOrderDate = new Date();
    if (order_date !== undefined) {
      parsedOrderDate = new Date(order_date);
      if (isNaN(parsedOrderDate.getTime())) {
        return res.status(400).json({ error: 'Invalid order_date format' });
      }
    }

    // 4. Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // 5. Aggregate requested quantities and validate each item structure
    const productQuantities = {};
    for (const item of items) {
      if (!item.product_id || !mongoose.Types.ObjectId.isValid(item.product_id)) {
        return res.status(400).json({ error: 'Each item must have a valid product_id' });
      }

      if (
        item.quantity === undefined ||
        typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          error: 'Item quantity must be an integer greater than or equal to 1',
        });
      }

      const pidStr = item.product_id.toString();
      productQuantities[pidStr] = (productQuantities[pidStr] || 0) + item.quantity;
    }

    // 6. Check product existence and stock availability
    const productMap = {};
    for (const [pidStr, totalQty] of Object.entries(productQuantities)) {
      const product = await Product.findById(pidStr);
      if (!product) {
        return res.status(400).json({ error: `Product with ID ${pidStr} not found` });
      }

      if (totalQty > product.stock) {
        return res.status(409).json({
          error: `Insufficient stock for product '${product.name}'. Requested: ${totalQty}, Available: ${product.stock}`,
        });
      }

      productMap[pidStr] = product;
    }

    // 7. Calculate server-side prices and totals
    const calculatedItems = [];
    let calculatedTotalAmount = 0;

    for (const item of items) {
      const pidStr = item.product_id.toString();
      const product = productMap[pidStr];
      const price_at_order = product.price;
      const total = price_at_order * item.quantity;

      calculatedItems.push({
        product_id: product._id,
        quantity: item.quantity,
        price_at_order,
        total,
      });

      calculatedTotalAmount += total;
    }

    // 8. Create and save order
    const order = new Order({
      customer_id: customer._id,
      items: calculatedItems,
      total_amount: calculatedTotalAmount,
      payment_method: payment_method.trim(),
      status: status.trim(),
      order_date: parsedOrderDate,
    });

    const savedOrder = await order.save();
    await savedOrder.populate(['customer_id', 'items.product_id']);

    return res.status(201).json(savedOrder);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PUT /api/orders/:id
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { customer_id, items, payment_method, status, order_date } = req.body;

    // 1. If customer_id is provided, validate
    if (customer_id !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(customer_id)) {
        return res.status(400).json({ error: 'Invalid customer_id format' });
      }
      const customer = await Customer.findById(customer_id);
      if (!customer) {
        return res.status(400).json({ error: 'Customer not found' });
      }
      order.customer_id = customer._id;
    }

    // 2. If payment_method is provided, validate
    if (payment_method !== undefined) {
      if (typeof payment_method !== 'string' || payment_method.trim() === '') {
        return res.status(400).json({ error: 'Payment method must be a non-empty string' });
      }
      order.payment_method = payment_method.trim();
    }

    // 3. If status is provided, validate
    if (status !== undefined) {
      if (typeof status !== 'string' || status.trim() === '') {
        return res.status(400).json({ error: 'Status must be a non-empty string' });
      }
      order.status = status.trim();
    }

    // 4. If order_date is provided, validate
    if (order_date !== undefined) {
      const parsedDate = new Date(order_date);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid order_date format' });
      }
      order.order_date = parsedDate;
    }

    // 5. If items are provided, validate and recalculate
    if (items !== undefined) {
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      const productQuantities = {};
      for (const item of items) {
        if (!item.product_id || !mongoose.Types.ObjectId.isValid(item.product_id)) {
          return res.status(400).json({ error: 'Each item must have a valid product_id' });
        }

        if (
          item.quantity === undefined ||
          typeof item.quantity !== 'number' ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1
        ) {
          return res.status(400).json({
            error: 'Item quantity must be an integer greater than or equal to 1',
          });
        }

        const pidStr = item.product_id.toString();
        productQuantities[pidStr] = (productQuantities[pidStr] || 0) + item.quantity;
      }

      const productMap = {};
      for (const [pidStr, totalQty] of Object.entries(productQuantities)) {
        const product = await Product.findById(pidStr);
        if (!product) {
          return res.status(400).json({ error: `Product with ID ${pidStr} not found` });
        }

        if (totalQty > product.stock) {
          return res.status(409).json({
            error: `Insufficient stock for product '${product.name}'. Requested: ${totalQty}, Available: ${product.stock}`,
          });
        }

        productMap[pidStr] = product;
      }

      const calculatedItems = [];
      let calculatedTotalAmount = 0;

      for (const item of items) {
        const pidStr = item.product_id.toString();
        const product = productMap[pidStr];
        const price_at_order = product.price;
        const total = price_at_order * item.quantity;

        calculatedItems.push({
          product_id: product._id,
          quantity: item.quantity,
          price_at_order,
          total,
        });

        calculatedTotalAmount += total;
      }

      order.items = calculatedItems;
      order.total_amount = calculatedTotalAmount;
    }

    const updatedOrder = await order.save();
    await updatedOrder.populate(['customer_id', 'items.product_id']);

    return res.status(200).json(updatedOrder);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
};
