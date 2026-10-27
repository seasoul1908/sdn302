const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');

// GET /api/products
const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, price, category, stock } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Product name is required and must be a non-empty string' });
    }

    if (price === undefined || typeof price !== 'number' || isNaN(price) || price < 0) {
      return res.status(400).json({ error: 'Price is required and must be a non-negative number' });
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return res.status(400).json({ error: 'Category is required and must be a non-empty string' });
    }

    if (stock === undefined || typeof stock !== 'number' || isNaN(stock) || stock < 0) {
      return res.status(400).json({ error: 'Stock is required and must be a non-negative number' });
    }

    const product = new Product({
      name: name.trim(),
      price,
      category: category.trim(),
      stock,
    });

    const savedProduct = await product.save();
    return res.status(201).json(savedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const updateData = {};
    const { name, price, category, stock } = req.body;

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Product name must be a non-empty string' });
      }
      updateData.name = name.trim();
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }
      updateData.price = price;
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim() === '') {
        return res.status(400).json({ error: 'Category must be a non-empty string' });
      }
      updateData.category = category.trim();
    }

    if (stock !== undefined) {
      if (typeof stock !== 'number' || isNaN(stock) || stock < 0) {
        return res.status(400).json({ error: 'Stock must be a non-negative number' });
      }
      updateData.stock = stock;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if referenced by any order
    const isReferenced = await Order.exists({ 'items.product_id': id });
    if (isReferenced) {
      return res.status(409).json({
        error: 'Cannot delete product because it is referenced by an order',
      });
    }

    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
