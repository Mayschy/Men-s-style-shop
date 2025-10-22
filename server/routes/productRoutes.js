// fashion-bot-backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const protect = require('../middleware/authMiddleware'); 
const { admin } = require('../middleware/adminMiddleware'); 


router.get('/', productController.getProducts);

router.post('/', protect, admin, productController.addProduct);


router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;