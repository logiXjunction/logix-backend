const Transporter = require('./transporter');
const Shipper = require('./shipper');
const Vehicle = require('./vehicle');
const Driver = require('./driver.js');

Transporter.hasMany(Vehicle, { foreignKey: 'transporterId', as: 'vehicles' });
Vehicle.belongsTo(Transporter, { foreignKey: 'transporterId', as: 'transporter' });

const models = {
  Transporter,
  Shipper,
  Vehicle,
  Driver
};

module.exports = models;
