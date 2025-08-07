const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const {
    createConsignment,
    getAllConsignments,
    getConsignmentsByStatus
} = require('../controllers/consignmentController');

//Post route for creating a consignment
router.post('/create', protect, createConsignment);

//Get route to fetch all the consignments
router.get('/all', protect, getAllConsignments);

//Get route to fetch the consignments by status
router.get('/status/:status', protect, getConsignmentsByStatus);

module.exports = router;