const { Transporter } = require('../models');
const jwt = require('jsonwebtoken');

// Validation function for transporter registration
const validateTransporterRegistrationInput = async (req) => {
  console.log('Validating transporter registration input:', req.body);

  // Initialize an array to hold validation errors
  const errors = [];
  const {
    ownerName,
    ownerContactNumber,
    email,
    phoneNumber,
    password,
    companyName,
    companyAddress,
    gstNumber
  } = req.body;

  // Validate required fields
  if (!ownerName) errors.push('Owner name is required');
  if (!ownerContactNumber) errors.push('Owner contact number is required');
  if (!email) errors.push('Email is required');
  if (!phoneNumber) errors.push('Phone number is required');
  if (!password) errors.push('Password is required');
  if (!companyName) errors.push('Company name is required');
  if (!companyAddress) errors.push('Company address is required');
  if (!gstNumber) errors.push('GST number is required');

  // Validate GST number format (basic validation)
  if (gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)) {
    console.log('Validation error: Invalid GST number format');
    errors.push('Invalid GST number format');
  }
  
  // Check if gst number already exists in Transporter
  if (gstNumber) {
    const existingGstNumber = await Transporter.findOne({ where: { gstNumber } });
    if (existingGstNumber) errors.push('GST number is already registered, please login');
  }

  // Check if email or phoneNumber already exists in Transporter
  if (email) {
    const existingEmail = await Transporter.findOne({ where: { email } });
    if (existingEmail) errors.push('Email is already registered');
  }

  if (phoneNumber) {
    const existingPhone = await Transporter.findOne({ where: { phoneNumber } });
    if (existingPhone) errors.push('Phone number is already registered');
  }

  console.log('Validation errors:', errors);
  return errors;
};

// Controller for transporter registration
exports.registerTransporter = async (req, res) => {
  try {
    console.log('Received transporter registration request:', req.body);

    // Validate input data
    const validationErrors = await validateTransporterRegistrationInput(req);
    
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    console.log('Input validation passed');


    // Extract required fields from request body
    const {
      ownerName,
      ownerContactNumber,
      email,
      phoneNumber,
      password,
      companyName,
      companyAddress,
      gstNumber
    } = req.body;

    // Create new transporter
    const newTransporter = await Transporter.create({
      ownerName,
      ownerContactNumber,
      email,
      phoneNumber,
      password,
      companyName,
      companyAddress,
      gstNumber
    });

    // Remove password from response
    const transporterData = newTransporter.toJSON();
    delete transporterData.password;

    return res.status(201).json({
      success: true,
      message: 'Transporter registered successfully',
      data: transporterData
    });
  } catch (error) {
    console.error('Error during transporter registration:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during transporter registration',
      error: error.message
    });
  }
};

// Controller for transporter login
exports.loginTransporter = async (req, res) => {
  try {
    const { email, mobileNumber, password } = req.body;

    // Validate required fields - either email or mobileNumber must be provided
    if ((!email && !mobileNumber) || !password) {
      return res.status(400).json({
        success: false,
        message: 'Either email or mobile number, and password are required'
      });
    }

    // Find the transporter by email or mobileNumber
    let transporter;
    if (email) {
      transporter = await Transporter.findOne({ where: { email } });
    } else {
      transporter = await Transporter.findOne({ where: { mobileNumber } });
    }

    // Check if transporter exists
    if (!transporter) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await transporter.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token with available identifier (email or mobileNumber)
    const token = jwt.sign(
      { 
        id: transporter.id, 
        email: transporter.email, 
        mobileNumber: transporter.mobileNumber,
        companyName: transporter.companyName,
        userType: 'transporter' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    // Return success with token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: transporter.id,
        companyName: transporter.companyName,
        email: transporter.email,
        mobileNumber: transporter.mobileNumber
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Protected controller for home route
exports.getHome = async (req, res) => {
  try {
    // req.transporter is set by the auth middleware after token verification
    const transporter = req.transporter;
    
    return res.status(200).json({
      success: true,
      message: 'Welcome to the protected home route',
      data: {
        transporter: {
          id: transporter.id,
          companyName: transporter.companyName,
          email: transporter.email,
          // Include other fields as needed without sensitive information
        }
      }
    });
  } catch (error) {
    console.error('Error in home route:', error);
    return res.status(500).json({
      success: false,
      message: 'Error retrieving home data',
      error: error.message
    });
  }
};

// Controller to fetch all transporters
exports.getAllTransporters = async (req, res) => {
  try {
    // Fetch all transporters from database
    const transporters = await Transporter.findAll({
      attributes: { exclude: ['password'] } // Exclude password from the response
    });
    
    return res.status(200).json({
      success: true,
      message: 'Transporters fetched successfully',
      count: transporters.length,
      data: transporters
    });
  } catch (error) {
    console.error('Error fetching transporters:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching transporters',
      error: error.message
    });
  }
};
