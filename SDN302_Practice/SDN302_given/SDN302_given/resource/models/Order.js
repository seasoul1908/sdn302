const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for quantity',
      },
    },
    price_at_order: {
      type: Number,
      required: [true, 'Price at order is required'],
      min: [0, 'Price at order must be non-negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total item price is required'],
      min: [0, 'Total must be non-negative'],
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer ID is required'],
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Items are required'],
      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },
        message: 'Order must contain at least one item',
      },
    },
    total_amount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be greater than or equal to 0'],
    },
    payment_method: {
      type: String,
      required: [true, 'Payment method is required'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      trim: true,
    },
    order_date: {
      type: Date,
      required: [true, 'Order date is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
  }
);

module.exports = mongoose.model('Order', orderSchema);
