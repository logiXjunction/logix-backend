const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Consignment = sequelize.define('Consignment', {
    consignmentID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    shipmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'shipment_id',
        references: {
            model: 'transporters',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    status: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected', 'Live', 'Completed'),
        defaultValue: 'Pending'
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    destination: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pickupDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'pickup_date'
    },
    deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'delivery_date'
    },
    rejectionReason: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'rejection_reason'
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
    tableName: 'consignment',
    timestamps: true
})

module.exports = Consignment;

