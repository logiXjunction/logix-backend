const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const Transporter = sequelize.define('Transporter', {
  // Primary key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ownerName: {
    type: DataTypes.STRING,
    field: 'owner_name',
    allowNull: false, 
  },
  ownerContactNumber: {
    type: DataTypes.STRING,
    field: 'owner_contact_number',
    allowNull: false,
    validate: {
      isTenDigitNumber(value) {
        if (value && !/^\d{10}$/.test(value)) {
          throw new Error('Contact number must be a 10 digit number');
        }
      }
    }
  },
  phoneNumber: {
    type: DataTypes.STRING,
    field: 'phone_number',
    allowNull: false,
    validate: {
      isTenDigitNumber(value) {
        if (value && !/^\d{10}$/.test(value)) {
          throw new Error('Phone number must be a 10 digit number');
        }
      }
    }
  },
  designation: {
    type: DataTypes.STRING,
    allowNull: true, 
    field: 'designation'
  },
  // Required fields as per the specifications
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'company_name'
  },
  companyAddress: {
    type: DataTypes.TEXT,
    field: 'company_address',
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: true
    }
  },
  isEmailVerified: { //Needed to check if users email has been verified of not
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'email_verified'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerServiceNumber: {
    type: DataTypes.STRING,
    defaultValue: null,
    field: 'customer_service_number'
  },
  gstNumber: {
    type: DataTypes.STRING,
    field: 'gst_number',
    allowNull: false,
    validate: {
      // Custom GST validation
      isValidGST(value) {
        if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
          throw new Error('Invalid GST number format');
        }
      }
    }
  },
  cinNumber: {
    type: DataTypes.STRING,
    field: 'cin_number',
    defaultValue: null
  },
  fleetCount: {
    type: DataTypes.INTEGER,
    field: 'fleet_count',
    defaultValue: 0
  },
  serviceArea: {
    type: DataTypes.STRING,
    field: 'service_area',
    defaultValue: null
  },
  pincode: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  districtCityRates: {
    type: DataTypes.TEXT, 
    field: 'district_city_rates',
    defaultValue: null
  },
  serviceType: {
    type: DataTypes.STRING,
    field: 'service_type',
    defaultValue: null
  },
  etdDetails: {
    type: DataTypes.TEXT, // JSON string for ETD details per city
    field: 'etd_details',
    defaultValue: null
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'transporters',
  timestamps: true,
  hooks: {
    beforeCreate: async (transporter) => {
      if (transporter.password) {
        const salt = await bcrypt.genSalt(10);
        transporter.password = await bcrypt.hash(transporter.password, salt);
      }
    },
    beforeUpdate: async (transporter) => {
      if (transporter.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        transporter.password = await bcrypt.hash(transporter.password, salt);
      }
    }
  }
});

// Instance method to check password
Transporter.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = Transporter;
