const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Shipment = sequelize.define('Shipment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    shipperId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'shippers',
            key: 'id'
        },
        field: 'shipper_id',
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pickup_location'
    },
    dropLocation: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'drop_location'
    },
    materialType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'material_type'
    },
    coolingType:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cooling_type'
    },
    weightKg: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'weight_kg'
    },
    lengthFt: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'length_ft'
    },
    widthFt: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'width_ft'
    },
    heightFt: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'height_ft'
    },
    estimatedDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'estimated_delivery_date',
    },
    valueInr: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'value_inr'
    },
    shipmentType: {
        type: DataTypes.ENUM('full_truck_load', 'part_truck_load'),
        allowNull: false,
        field: 'shipment_type'
    },
    eBayBillUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'ebay_bill_url'
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'created_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        field: 'updated_at'
    }
}, {
    tableName: 'shipments',
    timestamps: true

})

module.exports = Shipment;
