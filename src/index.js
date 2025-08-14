require('dotenv').config({path: require('path').resolve(__dirname, '../.env')});//.env not in /src
const express = require('express');
const {connectRedis} = require('./config/redis');
const validationRoutes = require('./routes/validationRoutes');
const sequelize = require('./config/database');
const transporterRoutes = require('./routes/transporterRoutes');
const shipperRoutes = require('./routes/shipperRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:3000', 'https://logixjunction.com/'];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not an allowed origin'));
    }
  },
  credentials: true,
})); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Ultron backend works fine 💥');
});

// API Routes
app.use('/api/validate', validationRoutes);
app.use('/api/transporters', transporterRoutes);
app.use('/api/shipper', shipperRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/inquiry', inquiryRoutes);


// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection and server start
const startServer = async () => {
  try {
    // Database connection and sync is already handled in database.js
    // No need to authenticate or sync again here

    app.listen(PORT, () => {
      console.log(`Ultron server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};


startServer();
