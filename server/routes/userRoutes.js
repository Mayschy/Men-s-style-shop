const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const Product = require("../models/Product");

// GET /api/user/profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching profile.", error: err.message });
  }
});

// PUT /api/user/profile
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    const updateObject = {};
    for (const key in updates) {
      if (key === "street" || key === "city" || key === "zip" || key === "country") {
        updateObject[`shippingAddress.${key}`] = updates[key];
      } else {
        updateObject[key] = updates[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateObject },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error while updating profile.", error: err.message });
  }
});

// GET /api/user/cart
router.get("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const cartItems = user.cart.filter(item => item.productId !== null);
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart.", error: err.message });
  }
});

// POST /api/user/cart
// Reserve stock when adding to cart: decrement specific size stock atomically.
router.post("/cart", auth, async (req, res) => {
  const { productId, quantity = 1, size } = req.body;

  if (!productId || !size) {
    return res.status(400).json({ message: "Product ID and size are required." });
  }
  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity." });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find product and check stock for specific size
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const sizeStock = product.sizes.find(s => s.size === size);
    if (!sizeStock || sizeStock.stock < quantity) {
      return res.status(400).json({ message: `Not enough stock for size ${size}.` });
    }

    // Decrement stock atomically with validation (prevents negative stock)
    const result = await Product.updateOne(
      { _id: productId, "sizes.size": size, "sizes.$.stock": { $gte: quantity } },
      { $inc: { "sizes.$.stock": -quantity } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: `Not enough stock for size ${size}.` });
    }

    // Add or update item in user's cart (distinguish by productId + size)
    const itemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity, size });
    }

    await user.save();
    await user.populate("cart.productId");

    res.status(200).json(user.cart.filter(item => item.productId !== null));
  } catch (err) {
    res.status(500).json({ message: "Error updating cart.", error: err.message });
  }
});

// DELETE /api/user/cart/:productId
// Restore reserved stock when removing from cart: increment specific size stock.
router.delete("/cart/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { productId } = req.params;
    const { size } = req.query;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const cartItem = user.cart.find(
      item => item.productId.toString() === productId && item.size === size
    );
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    const restoreQuantity = cartItem.quantity || 0;
    const restoreSize = cartItem.size;

    // Restore the stock for the specific size
    await Product.updateOne(
      { _id: productId, "sizes.size": restoreSize },
      { $inc: { "sizes.$.stock": restoreQuantity } }
    );

    // Remove item from user's cart
    user.cart = user.cart.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );

    await user.save();

    res.status(200).json({ message: "Item removed from cart and stock restored." });
  } catch (err) {
    res.status(500).json({ message: "Error removing item from cart.", error: err.message });
  }
});

// POST /api/user/checkout
// Finalize order: stock already reserved during add-to-cart.
router.post("/checkout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Verify that reserved items still exist
    for (const cartItem of user.cart) {
      if (!cartItem.productId) {
        return res.status(400).json({ message: `Product in cart not available.` });
      }
    }

    // Calculate total amount and create order items
    let totalAmount = 0;
    const orderItems = user.cart.map(cartItem => {
      const price = cartItem.productId.price;
      totalAmount += price * cartItem.quantity;
      return {
        productId: cartItem.productId._id,
        quantity: cartItem.quantity,
        size: cartItem.size,
        price: price
      };
    });

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    const newOrder = {
      orderNumber,
      items: orderItems,
      totalAmount,
      shippingAddress: user.shippingAddress,
      status: "Completed",
      createdAt: new Date()
    };

    user.orders.push(newOrder);

    // Clear cart (stock already decremented when added to cart)
    user.cart = [];
    await user.save();

    res.json({ message: "Order successfully placed and cart cleared.", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Error during checkout.", error: err.message });
  }
});

// GET /api/user/orders
router.get("/orders", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("orders.items.productId");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user.orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders.", error: err.message });
  }
});

module.exports = router;
