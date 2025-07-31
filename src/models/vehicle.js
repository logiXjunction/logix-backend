const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
    vehicleName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'vehicle_name'
    },
    dimension: {
        type: DataTypes.JSON, // will contain { length, width, height and unit }
        allowNull: false,
        field: 'dimension',
    },
    capacity: {
        type: DataTypes.JSON, // will contain { value and unit }
        allowNull: false, 
        field: 'capacity'
    },
    vehicleType: {
        type: DataTypes.ENUM('truck', 'trailer', 'container', 'tank', 'other'),
        allowNull: false,
        field: 'vehicle_type'
    },
    vehicleNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: 'vehicle_number'
    },
    isRefrigerated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'is_refrigerated'
    },
    bodyType: {
        type: DataTypes.ENUM('open', 'closed'),
        allowNull: false,
        field: 'body_type'
    },
    rcUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'rc_url',
        validate: {
            isValidUrl(value) {
                if (!isUrl(value)) {
                    throw new Error('rcUrl must be a valid URL');
                }
            }
        }
    },
    roadPermitUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'road_permit_url',
        validate: {
            isValidUrl(value) {
                if (!isUrl(value)) {
                    throw new Error('roadPermitUrl must be a valid URL');
                }
            }
        }
    },
    pollutionCertificateUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'pollution_certificate_url',
        validate: {
            isValidUrl(value) {
                if (!isUrl(value)) {
                    throw new Error('pollutionCertificateUrl must be a valid URL');
                }
            }
        }
    },
    transporterName:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'transporter_name'
    },
    transporterId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'transporter_id',
        references: {
            model: 'transporters', // Assuming the Transporter model is defined in the same database
            key: 'id'
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
    }
}, {
    tableName: 'Vehicles',
    timestamps: true
});



module.exports = Vehicle;
