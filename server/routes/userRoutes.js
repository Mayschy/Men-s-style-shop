// fashion-bot-backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");
const Product = require("../models/Product");

//(GET /api/user/profile)
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Server error while fetching profile.",
        error: err.message,
      });
  }
});

//(PUT /api/user/profile)
router.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    const updateObject = {};
    for (const key in updates) {
      if (
        key === "street" ||
        key === "city" ||
        key === "zip" ||
        key === "country"
      ) {
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
    res
      .status(500)
      .json({
        message: "Server error while updating profile.",
        error: err.message,
      });
  }
});

//(POST /api/user/checkout)
// Finalize order: do not change stock here (stock is reserved on add-to-cart).
router.post("/checkout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Verify that reserved items still exist (product may have been deleted)
    for (const cartItem of user.cart) {
      if (!cartItem.productId) {
        return res.status(400).json({ message: `Product in cart not available: ${cartItem.productId}` });
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
        price: price
      };
    });

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create new order
    const newOrder = {
      orderNumber,
      items: orderItems,
      totalAmount,
      shippingAddress: user.shippingAddress,
      status: "Completed",
      createdAt: new Date()
    };

    // Add order to user's orders array
    user.orders.push(newOrder);

    // Clear cart (stock was already reserved when items were added to cart)
    user.cart = [];
    await user.save();

    res.json({ 
      message: "Order successfully placed and cart cleared.",
      order: newOrder
    });

  } catch (err) {
    res.status(500).json({ message: "Error during checkout.", error: err.message });
  }
});
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    await user.populate("cart.productId");

    res.status(200).json(user.cart.filter(item => item.productId !== null));

  } catch (err) {
    res.status(500).json({ message: "Error updating cart.", error: err.message });
  }
});

//(DELETE /api/user/cart/:productId)
// Remove item from cart and restore reserved stock (increment Product.stock).
router.delete("/cart/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const cartItem = user.cart.find(item => item.productId.toString() === productId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart.' });
    }

    const restoreQuantity = cartItem.quantity || 0;

    // Restore the stock
    await Product.findByIdAndUpdate(productId, { $inc: { stock: restoreQuantity }, $set: { isAvailable: true } });

    // Remove item from user's cart
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();

    res.status(200).json({ message: "Item removed from cart and stock restored." });

  } catch (err) {
    res.status(500).json({ message: "Error removing item from cart.", error: err.message });
  }
});

//(POST /api/user/checkout)
router.post("/checkout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Calculate total amount and create order items
    let totalAmount = 0;
    const orderItems = user.cart.map(cartItem => {
      const price = cartItem.productId.price;
      totalAmount += price * cartItem.quantity;
      return {
        productId: cartItem.productId._id,
        quantity: cartItem.quantity,
        price: price
      };
    });

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create new order
    const newOrder = {
      orderNumber,
      items: orderItems,
      totalAmount,
      shippingAddress: user.shippingAddress,
      status: "Completed",
      createdAt: new Date()
    };

    // Add order to user's orders array
    user.orders.push(newOrder);

    // Clear cart
    user.cart = [];
    await user.save();

    res.json({ 
      message: "Order successfully placed and cart cleared.",
      order: newOrder
    });

  } catch (err) {
    res.status(500).json({ message: "Error during checkout.", error: err.message });
  }
});

//(GET /api/user/orders)
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