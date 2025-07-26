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
        name: transporter.name,
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

exports.registerVehicle = async (req, res) => {
  try {
    const {
      vehicleName,
      vehicleNumber,
      vehicleType,
      dimension,
      capacity,
      isRefrigerated,
      bodyType,
    } = req.body;

    // Validate required fields
    if (!vehicleName || !vehicleNumber || !vehicleType || !dimension || !capacity || !isRefrigerated || !bodyType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: vehicleName, vehicleNumber, vehicleType, dimension, capacity, isRefrigerated, bodyType are required'
      });
    }
    // Validate vehicle number format (format: e.g., MH12AB1234)
    if (!/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/.test(vehicleNumber.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle number format. Expected format: XX00XX0000 (e.g., MH12AB1234)'
      });
    }
    //Verify vehicle type
    if (!['truck', 'trailer', 'container', 'tank', 'other'].includes(vehicleType)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid vehicle type. Allowed values are truck, trailer, container, tank, other'
      });
    }
    // Verify body type
    if (!['open', 'closed'].includes(bodyType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid body type. Allowed values are open, closed, refrigerated'
      });
    }

    //verify dimension if they are number or not and have unit(length, width, height and unit)
    const { length, width, height, unit } = dimension;
    if (
      typeof length !== 'number' ||
      typeof width !== 'number' ||
      typeof height !== 'number' ||
      !['feet', 'meters'].includes(unit)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dimension format. Expected format: { length: number, width: number, height: number, unit: "feet" | "meters" }'
      });
    }

    //verify isRefrigerated is boolean
    if (typeof isRefrigerated !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Invalid isRefrigerated format. Expected boolean value'
      });
    }
    //check if roadpermit,pollutionCertificate and rc documents are provided
    //upload documents to S3 and get the urls
    //check vehicle number is unique
    const existingVehicle = await Vehicle.findOne({ where: { vehicleNumber } });
    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle with this number already exists'
      });
    }
    //Verify if vehicle number is valid through gov api's

    //get transportername and transportedid from authorization token
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, name } = decoded;


    // Create new vehicle
    const newVehicle = await Vehicle.create({
      vehicleName,
      bodyType,
      vehicleNumber,
      vehicleType,
      dimension,
      capacity,
      isRefrigerated: isRefrigerated || false,
      rcUrl: rcUrl || 'www.helo.com',
      roadPermitUrl: roadPermitUrl || 'www.helo.com',
      pollutionCertificateUrl: pollutionCertificateUrl || 'www.helo.com',
      transporterName: name,
      transporterId: id
    });

    return res.status(201).json({
      success: true,
      message: 'Vehicle registered successfully',
      data: newVehicle
    });
  } catch (error) {
    console.error('Error registering vehicle:', error);
    return res.status(500).json({
      success: false,
      message: 'Error registering vehicle',
      error: error.message
    });
  }
}