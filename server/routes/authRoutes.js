// fashion-bot-backend/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// (POST /api/auth/register) ---
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, street, city, zip, country } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      shippingAddress: { street, city, zip, country },
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully. Please sign in.",
      userId: newUser._id,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error during registration.",
      error: err.message,
    });
  }
});

// (POST /api/auth/login) ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid credentials: User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid credentials: Password incorrect." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role, 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );


    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.firstName || user.email.split("@")[0],
        role: user.role || "user",
      },
    });
  } catch (err) {

    console.error("Login Error:", err);
    res
      .status(500)
      .json({ message: "Server error during login.", error: err.message });
  }
});

module.exports = router;
