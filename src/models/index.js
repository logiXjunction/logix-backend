const Transporter = require('./transporter');
const Shipper = require('./shipper');
const Vehicle = require('./vehicle');

Transporter.hasMany(Vehicle, { foreignKey: 'transporterId', as: 'vehicles' });
Vehicle.belongsTo(Transporter, { foreignKey: 'transporterId', as: 'transporter' });

const models = {
  Transporter,
  Shipper,
  Vehicle
};

module.exports = models;
