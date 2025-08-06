const express = require('express');
const shipperController = require('../controllers/shipperController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
// POST route for shipper registration (renamed from signup)
router.post('/register', shipperController.registerShipper);

// POST route for shipper login
router.post('/login', shipperController.loginShipper);

// Protected routes (requires authentication)
// GET route for protected home page
router.get('/home', protect, shipperController.getHome);
// Protected route to get current logged-in shipper
router.get('/me', protect, shipperController.getCurrentShipper);

module.exports = router;
