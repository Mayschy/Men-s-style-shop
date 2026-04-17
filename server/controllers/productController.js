const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const [products, totalCount] = await Promise.all([
            Product.find().skip(skip).limit(limit),
            Product.countDocuments()
        ]);

        res.json({
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCount,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addProduct = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        imageUrl: req.body.imageUrl,
        stock: req.body.stock || 0,
        styleTags: req.body.styleTags || [],
        isAvailable: (req.body.stock || 0) > 0
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, imageUrl, stock, styleTags } = req.body;
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                category,
                imageUrl,
                stock: stock || 0,
                styleTags: styleTags || [],
                isAvailable: (stock || 0) > 0
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};