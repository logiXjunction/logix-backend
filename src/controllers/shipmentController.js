const Shipment = require('../models/shipment');

exports.createShipment = async (req, res) => {
  try {
    const {pickupLocation, dropLocation, materialType, coolingType, weightKg, lengthFt, widthFt, heightFt, estimatedDeliveryDate, valueInr, shipmentType} = req.body;

    // Validate required fields
    if (!pickupLocation || !dropLocation || !materialType || !coolingType || !weightKg || !lengthFt || !widthFt || !heightFt || !estimatedDeliveryDate || !valueInr || !shipmentType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    //Get shipperId from JWT token
    const shipperId = req.user.shipperId;

    // Create shipment
    const shipment = await Shipment.create({
      shipperId,
      pickupLocation,
      dropLocation,
      materialType,
      coolingType,
      weightKg,
      lengthFt,
      widthFt,
      heightFt,
      estimatedDeliveryDate,
      valueInr,
      shipmentType,
      eBayBillUrl: 'http://url.com'
    });

    return res.status(201).json({
      success: true,
      data: shipment
    });
  } catch (error) {
    console.error('Error creating shipment:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
