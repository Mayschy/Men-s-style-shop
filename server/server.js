// server/server.js 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 === SERVER STARTING ===');
console.log('📝 Environment Check:');
console.log('   PORT:', PORT);
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? 'SET ✓' : 'NOT SET ✗');
console.log('   CORS_ORIGIN:', process.env.CORS_ORIGIN || 'NOT SET');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'production');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRouter = require('./controllers/aiController');

// MongoDB Connection with detailed logging
console.log('\n📡 Connecting to MongoDB...');
console.log('   URI Preview:', process.env.MONGODB_URI?.substring(0, 50) + '...' || 'UNDEFINED');

mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    family: 4
})
.then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('   Database:', mongoose.connection.name || 'default');
    console.log('   Host:', mongoose.connection.host || 'unknown');
})
.catch(err => {
    console.error('❌ MongoDB connection FAILED!');
    console.error('   Error Name:', err.name);
    console.error('   Error Message:', err.message);
    console.error('   Error Code:', err.code);
    if (err.reason) console.error('   Reason:', err.reason);
    console.error('   Full Error:', JSON.stringify(err, null, 2));
    process.exit(1);
});

// Connection events
mongoose.connection.on('connected', () => {
    console.log('📍 MongoDB connected event triggered');
});

mongoose.connection.on('disconnected', () => {
    console.error('📍 MongoDB disconnected!');
});

mongoose.connection.on('error', (err) => {
    console.error('📍 MongoDB connection error event:', err.message);
});


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
    process.env.CORS_ORIGIN,
    'http://localhost:5173',
    'https://mensfashion.site',
    'https://www.mensfashion.site',
    'https://mens-style-shop.vercel.app',
    'https://mens-style-shop-theta.vercel.app',
];

console.log('\n🔐 CORS Settings:');
console.log('   Allowed Origins:', allowedOrigins);

const corsOptions = {
    origin: (origin, callback) => {

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {

            console.warn(`⚠️  CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, 
};

app.use(cors(corsOptions));
app.use('/api/products', productRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);
app.use('/api/ai', aiRouter);

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', {
        message: err.message,
        name: err.name,
        path: req.path,
        method: req.method,
        status: err.status || 500,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

    // Ensure err is an Error object
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    const errorStatus = typeof err.status === 'number' ? err.status : 500;

    res.status(errorStatus).json({
        error: errorMessage,
        path: req.path
    });
});

app.listen(PORT, () => {
    console.log('\n✅ === SERVER READY ===');
    console.log(`🌐 Server is running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log('💡 All routes registered and ready to use\n');
});