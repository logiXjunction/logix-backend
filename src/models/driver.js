const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  driverName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'driver_name',
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'phone_number',
    validate: {
      isTenDigitNumber(value) {
        if (!/^\d{10}$/.test(value)) {
          throw new Error('Phone number must be a 10-digit number');
        }
      }
    }
  },
  transporterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'transporter_id',
    references: {
      model: 'transporters',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  transporterName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'transporter_name',
  },
  vehicleNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'vehicle_number',
  },
  aadhaar: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'aadhaar',
    validate: {
      isTwelveDigitNumber(value) {
        if (!/^\d{12}$/.test(value)) {
          throw new Error('Aadhaar number must be a 12-digit number');
        }
      }
    }
  },
  license: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'license',
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'photo_url',
    validate: {
      isUrl: true,
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  tableName: 'drivers',
  timestamps: true,
});

module.exports = Driver;
