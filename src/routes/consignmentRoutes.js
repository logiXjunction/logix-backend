const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();
const consignmentController = require('../controllers/consignmentController');

//Post route for creating a consignment
router.post('/create', protect, consignmentController.createConsignment);

//Get route to fetch all the consignments
router.get('/all', protect, consignmentController.getAllConsignments);

//Get route to fetch the consignments by status
router.get('/status/:status', protect, consignmentController.getConsignmentsByStatus);

module.exports = router;