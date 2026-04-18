const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  size: {
    type: String,
    required: true,
  },
});

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    zip: { type: String },
    country: { type: String },
  },
  status: { type: String, default: "Completed", enum: ["Pending", "Processing", "Shipped", "Completed", "Cancelled"] },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },

    shippingAddress: {
      street: { type: String },
      city: { type: String },
      zip: { type: String },
      country: { type: String },
    },

    cart: [cartItemSchema],
    orders: [orderSchema],

    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
