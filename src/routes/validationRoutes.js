const express = require('express');
const ValidationController = require('../controllers/ValidationController');
const router = express.Router();


//POST route for sending otp to users phone number
router.post('/send-otp', ValidationController.sendOtp);

//POST route for verifiying otp
router.post('/verify-otp', ValidationController.verifyOtp);

// POST - Check if user email is verified / token status
router.post('/check-email-status', ValidationController.checkVerificationStatus);

// POST - Send new verification email (removes old token if exists)
router.post('/send-email-link', ValidationController.sendVerificationEmail);

// GET - Verify email via token (used in email link)
router.get('/verify-email-link', ValidationController.verifyEmailToken);



module.exports = router;
