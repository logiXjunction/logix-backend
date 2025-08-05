const Transporter = require('./transporter');
const Shipper = require('./shipper');
const Vehicle = require('./vehicle');
const Driver = require('./driver.js');
const Shipment = require('./shipment');

Transporter.hasMany(Vehicle, { foreignKey: 'transporterId', as: 'vehicles' });
Vehicle.belongsTo(Transporter, { foreignKey: 'transporterId', as: 'transporter' });
Shipment.belongsTo(Shipper, { foreignKey: 'shipperId', as: 'shipper' });
Shipper.hasMany(Shipment, { foreignKey: 'shipperId', as: 'shipments' });

const models = {
  Transporter,
  Shipper,
  Vehicle,
  Driver,
  Shipment
};

module.exports = models;
