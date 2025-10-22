// fashion-bot-backend/models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ['t-shirts', 'jackets', 'jeans', 'accessories'] },
    stock: { type: Number, default: 0 },
    imageUrl: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    styleTags: [String], 
});

module.exports = mongoose.model('Product', productSchema);