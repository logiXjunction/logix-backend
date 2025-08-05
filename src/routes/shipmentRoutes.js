const shipmentController = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

// POST route for creating a new shipment (Protected route)
router.post('/create', protect, shipmentController.createShipment);


module.exports = router;
