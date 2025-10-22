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

//(GET /api/user/cart)
router.get("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "cart.productId"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const cartItems = user.cart.filter(item => item.productId !== null);
    
    res.json(cartItems);

  } catch (err) {
    res.status(500).json({ message: "Error fetching cart.", error: err.message });
  }
});

//(POST /api/user/cart)
router.post("/cart", auth, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: "Invalid product ID or quantity." });
  }

  try {
    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: "User or Product not found." });
    }
    
    const itemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
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
router.delete("/cart/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    
    res.status(200).json({ message: "Item removed from cart." });

  } catch (err) {
    res.status(500).json({ message: "Error removing item from cart.", error: err.message });
  }
});

//(POST /api/user/checkout)
router.post("/checkout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    user.cart = [];
    await user.save();

    res.json({ message: "Order successfully placed and cart cleared." });

  } catch (err) {
    res.status(500).json({ message: "Error during checkout.", error: err.message });
  }
});

module.exports = router;