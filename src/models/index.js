const Transporter = require('./transporter');
const Shipper = require('./shipper');
const Vehicle = require('./vehicle');
const Driver = require('./driver.js');
const Consignment = require('./consignment');

Transporter.hasMany(Vehicle, { foreignKey: 'transporterId', as: 'vehicle' });
Vehicle.belongsTo(Transporter, { foreignKey: 'transporterId', as: 'transporter' });

// Shipment has many Consignments
Shipment.hasMany(Consignment, {
  foreignKey: 'shipment_id',
  as: 'consignments'
});
Consignment.belongsTo(Shipment, {
  foreignKey: 'shipment_id',
  as: 'shipment'
});
// Transporter has many Consignments
Transporter.hasMany(Consignment, {
  foreignKey: 'transporter_id',
  as: 'consignments'
});
Consignment.belongsTo(Transporter, {
  foreignKey: 'transporter_id',
  as: 'transporter'
});



const models = {
  Transporter,
  Shipper,
  Vehicle,
  Driver,
  Consignment
};

module.exports = models;
