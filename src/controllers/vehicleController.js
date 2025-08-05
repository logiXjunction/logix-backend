const Vehicle = require('../models/vehicle');
const jwt = require('jsonwebtoken');



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
    if (!vehicleName || !vehicleNumber || !vehicleType || !dimension || !capacity || !bodyType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: vehicleName, vehicleNumber, vehicleType, dimension, capacity, bodyType are required'
      });
    }
    // Validate vehicle number format (format: e.g., MH12AB1234)
    if (!/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/.test(vehicleNumber.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid vehicle number format. Expected format: XX00XX0000 (e.g., MH12AB1234)'
      });
    }
    // Verify body type
    if (!['open', 'closed'].includes(bodyType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid body type. Allowed values are open or closed'
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
      isRefrigerated,
      rcUrl: 'www.helo.com',
      roadPermitUrl: 'www.helo.com',
      pollutionCertificateUrl: 'www.helo.com',
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