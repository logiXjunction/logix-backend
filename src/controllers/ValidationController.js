const { redisClient } = require('../config/redis');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const {getUserModel,sendEmail} = require('../utils/helperUtils');
const axios = require('axios');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

//OTP sender function to user mobile number
exports.sendOtp = async (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }
  if( !/^\d{10}$/.test(mobileNumber)) {
    return res.status(400).json({ message: 'Invalid mobile number format. It should be a 10-digit number.' });
  }
  const API_KEY = process.env.API_KEY;


  try {
    // Check if an OTP already exists
    const existingOtp = await redisClient.get(`${mobileNumber}_phoneOtp`);
    if (existingOtp) {
      return res.status(429).json({ message: 'OTP already sent. Please wait before requesting another.' });
    }
    const otp = generateOtp();
    await redisClient.set(`${mobileNumber}_phoneOtp`, otp, { EX: 120 });
    const url = `https://2factor.in/API/V1/${API_KEY}/SMS/${mobileNumber}/${otp}`;
    const response = await axios.get(url);
    if (response.status !== 200) {
      return res.status(500).json({ message: 'Failed to send OTP', error: response.statusText });
    }
    if (response.data.Status === 'Success') {
      res.json({ message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send OTP', error: response.data.Message });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to send OTP', error: err.message });
  }
};

//OTP verifier function
exports.verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.body;
  if (!mobileNumber || !otp) {
    return res.status(400).json({ message: 'Mobile number and OTP are required' });
  }
  
  try {
    const cachedOtp = await redisClient.get(`${mobileNumber}_phoneOtp`);

    if(!cachedOtp) {
      return res.status(400).json({message:"OTP has expired"});
    }
    if (cachedOtp === otp) {
      return res.json({ message: 'OTP verified successfully' });
    } else {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error verifying OTP', error: err.message });
  }
};

// Function to check if user is verified/ not verified/ not verified but an active token exist
exports.checkVerificationStatus = async (req, res) => {
  const {email, gstNumber, userType } = req.body;

  try {
    const Model = getUserModel(userType);
    const user = await Model.findOne({ where: { gstNumber,email } });

    if (!user) return res.status(404).json({ status: 'user_not_found',message: 'wrong email or gstNumber' });
    if (user.isEmailVerified) return res.status(200).json({ status: 'verified' });

    const tokenExists = await redisClient.get(`${userType}_${email}_${gstNumber}`);
    if (tokenExists) return res.status(200).json({ status: 'token_sent_not_verified' });

    return res.status(200).json({ status: 'not_verified_no_token' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to send verification email (only sends new verification email when there is no active token already)
exports.sendVerificationEmail = async (req, res) => {
  const { email, gstNumber, userType } = req.body;
  
  try {
    const Model = getUserModel(userType);
    const user = await Model.findOne({ where: { gstNumber,email } });

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if user already have an active token
    const tokenExists = await redisClient.get(`${userType}:${gstNumber}`);
    if(tokenExists) return res.status(200).json({ status: 'active_token_exists' });

    // Generate JWT token(expires in 1 hour)
    const token = jwt.sign({ gstNumber,email,userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Store in Redis
    await redisClient.set(`${userType}_${email}_${gstNumber}`, token, { EX: 3600 });

    // Create verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `<p>Click the link to verify your email:</p><a href="${verificationLink}">${verificationLink}</a>`,
    });
    return res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    if(error.message=="Invalid userType") return res.status(400).json({error:error.message});
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Function to verify token
exports.verifyEmailToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(400).json({ message: 'Token is required' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const { gstNumber, userType, email } = decoded;

  try {
    const Model = getUserModel(userType);
    const user = await Model.findOne({ where: { gstNumber,email } });

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isEmailVerified) return res.status(200).json({ message: 'Email already verified' });

    const storedToken = await redisClient.get(`${userType}_${email}_${gstNumber}`);
    if (!storedToken || storedToken !== token) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isEmailVerified = true;
    await user.save();
    await redisClient.del(`${userType}_${email}_${gstNumber}`);

    return res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error : error.message });
  }
};

