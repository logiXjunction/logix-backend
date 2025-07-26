const express = require('express');
const transporterController = require('../controllers/transporterController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
// POST route for transporter registration (renamed from signup)
router.post('/register', transporterController.registerTransporter);

// POST route for transporter login
router.post('/login', transporterController.loginTransporter);

//POST route for vechicle registration
router.post('/register-vehicle', protect, transporterController.registerVehicle);

// Protected routes (requires authentication)
// GET route for protected home page
router.get('/home', protect, transporterController.getHome);

// GET route to fetch all transporters
router.get('/all', protect, transporterController.getAllTransporters);

module.exports = router;
