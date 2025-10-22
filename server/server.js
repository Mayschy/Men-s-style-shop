// server/server.js 

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 3000;

const productRoutes = require('./routes/productRoutes'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());


const allowedOrigins = [
    process.env.CORS_ORIGIN, 
    'http://localhost:5173',
];


const corsOptions = {
    origin: (origin, callback) => {

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {

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



app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);

});