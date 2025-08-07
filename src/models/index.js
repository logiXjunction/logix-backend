const Transporter = require('./transporter');
const Shipper = require('./shipper');
const Vehicle = require('./vehicle');
const Driver = require('./driver.js');
const Consignment = require('./consignment');

Transporter.hasMany(Vehicle, { foreignKey: 'transporterId', as: 'vehicles' });
Vehicle.belongsTo(Transporter, { foreignKey: 'transporterId', as: 'transporter' });

Consignment.belongsTo(Shipper, {foreignKey: 'shipperId', as: 'shipper'});
Consignment.belongsTo(Transporter, {foreignKey: 'transporterId', as: 'transporter'});
Shipper.hasMany(Consignment, {foreignKey: 'shipmentId',as: 'consignments'});
Transporter.hasMany(Consignment, {foreignKey: 'transporterId',as: 'consignments'});

const models = {
  Transporter,
  Shipper,
  Vehicle,
  Driver,
  Consignment
};

module.exports = models;
