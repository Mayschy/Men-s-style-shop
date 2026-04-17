const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, enum: ['t-shirts', 'jackets', 'jeans', 'accessories'] },
    sizes: [{
        size: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL'], required: true },
        stock: { type: Number, default: 0, min: 0 }
    }],
    imageUrl: { type: String, required: true },
    styleTags: [String],
});

// Virtual for total stock across all sizes
productSchema.virtual('totalStock').get(function() {
    if (!this.sizes || this.sizes.length === 0) return 0;
    return this.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
});

// Virtual for isAvailable based on totalStock
productSchema.virtual('isAvailable').get(function() {
    return this.totalStock > 0;
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
