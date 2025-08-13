const express = require('express');
const { inquiryForm } = require('../controllers/inquiryController.js');

const router = express.Router();

router.post('/', inquiryForm);

module.exports = router;