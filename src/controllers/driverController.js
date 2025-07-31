const Driver = require('../models/driver');
const Transporter = require('../models/transporter');

function dummyUrl(file) {
  return 'https://example.com';
}

exports.registerDriver = async (req, res) => {
  try {
    // Extract transporterId and transporterName from JWT (req.user)
    const { transporterId, transporterName } = req.user || {};
    // Extract other fields from request body
    const {
      driverName,
      phoneNumber,
      vehicleNumber,
      aadhaar,
      license,
    } = req.body;

    if (!driverName || !phoneNumber || !vehicleNumber || !aadhaar || !license || !transporterId || !transporterName) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: driverName, phoneNumber, vehicleNumber, aadhaar, license, transporterId, and transporterName are required'
      });
    }

    const photoFile = req.file;
    const photoUrl = dummyUrl(photoFile);

    if (!photoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Driver Photo is required'
      });
    }

    const existingTransporter = await Transporter.findByPk(transporterId);
    if (!existingTransporter) {
      return res.status(404).json({
        success: false,
        message: 'Transporter not found with the provided transporterId'
      });
    }

    if (existingTransporter.companyName !== transporterName) {
      return res.status(400).json({
        success: false,
        message: 'Transporter name does not match the registered transporter company name'
      });
    }

    const existingDriver = await Driver.findOne({
      where: {
        phoneNumber
      }
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this phone number already exists'
      });
    }

    const newDriver = await Driver.create({
      driverName,
      phoneNumber,
      transporterId,
      transporterName,
      vehicleNumber,
      aadhaar,
      license,
      photoUrl
    });

    return res.status(201).json({
      success: true,
      message: 'Driver registered successfully',
      data: newDriver
    });

  } catch (error) {
    console.error('Error registering driver:', error);
    return res.status(500).json({
      success: false,
      message: 'Error registering driver',
      error: error.message
    });
  }
};
