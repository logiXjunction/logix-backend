const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InquiryForm  = sequelize.define('InquiryForm', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name',
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'company_name',
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
    gstNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'gst_number',
        validate: {
        isValidGST(value) {
            if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
            throw new Error('Invalid GST number format');
            }
        }
        }
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pickup_location'
    },
    pickupAddressLine1: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pickup_address_line1'
    },
    pickupAddressLine2: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'pickup_address_line2'
    },
    pickupPincode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'pickup_pincode'
    },
    dropLocation: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'drop_location'
    },
    dropAddressLine1: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'drop_address_line1'
    },
    dropAddressLine2: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'drop_address_line2'
    },
    dropPincode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'drop_pincode'
    },
    materialType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'material_type'
    },
    customMaterialType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'custom_material_type'
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'weight_kg'
    },
    length: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'length_ft'
    },
    width: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'width_ft'
    },
    height: {
        type: DataTypes.FLOAT,
        allowNull: true,
        field: 'height_ft'
    },
    expectedDelivery: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expected_delivery',
    },
    expectedPickup: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expected_pickup',
    },
    transportMode: {
        type: DataTypes.ENUM(
            'Road Transport',
            'Rail Transport',
            'Air Transport',
            'Sea Transport',
            'Intermodal'
        ),
        allowNull: false,
        field: 'transport_mode'
    },
    shipmentType: {
        type: DataTypes.ENUM('full_truck_load', 'part_truck_load'),
        allowNull: false,
        field: 'shipment_type'
    },
    materialValue: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'material_value'
    },
    eBayBillUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'ebay_bill_url'
    },
    coolingType:{
        type: DataTypes.STRING,
        allowNull: false,
        field: 'cooling_type'
    },
    truckSize: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: {
                args: [['14 ft', '17 ft', '19 ft', '20 ft', '22 ft', '24 ft', '32 ft', '40 ft']],
                msg: 'Truck size must be one of the predefined options'
            }
        }
    },
    manpower: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false 
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

    tableName: 'inquiryform',

    timestamps: true

})

module.exports = InquiryForm;