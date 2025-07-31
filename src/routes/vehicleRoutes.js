const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

//POST route for vehicle registration(Protected route)
router.post('/register', protect, vehicleController.registerVehicle);
