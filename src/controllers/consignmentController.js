const Consignment = require('../models/consignment');
const Shipper  = require('../models/Shipper');
const Transporter = require('../models/Transporter');

//1 CREATE CONSIGNMENT
exports.createConsignment = async (req, res) => {
    try {
        // Extract feilds from req body
        const{
            shipperId, 
            source,
            destination 
        } = req.body;

        // Extract transporterId from JWT (req.user)
        const {id: transporterId} = req.user || {};

        //1 Validate feilds
        if(!shipperId || !transporterId || !source || !destination){
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: shipmentId, transporterId, source, or destination'
            });
        }

        //2 Ensure only shippers can create consignments
        if (req.user.userType !== 'shipper') {
            return res.status(404).json({
                success: false,
                message: 'Only shippers are allowed to create consignments.',
            });
        }

        //3 Ensure the shipper exists 
        const shipper  = await Shipper.findByPk(shipperId);
        if (!shipper) {
            return res.status(404).json({
                success: false,
                message: 'Shipper not found.',
            });
        }

        if (shipper.id!== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to create a consignment for this shipment.',
            });
        }

        //4 Check if transporter exists
        const transporter = await Transporter.findByPk(transporterId);
            if (!transporter) {
            return res.status(404).json({
                success: false,
                message: 'Transporter not found.',
            });
        }

        //5 Prevent duplicate consignment for this shipment
        const existingConsignment = await Consignment.findOne({
            where: { shipperId },
        });

        if (existingConsignment) {
            return res.status(409).json({
                success: false,
                message: 'Consignment already exists for this shipment.',
            });
        }
        
        //6 Create the consignment (default status to 'pending')
        const newConsignment = await Consignment.create({
            shipperId,
            transporterId,
            source,
            destination
        })

        //Return consignment
        return res.status(201).json({
            success: true,
            message: 'Consignment created successfully',
            data: newConsignment
        })
    } catch (err) {
        console.log('❌ Error creating consignment:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
};

//2 GET ALL CONSIGNMENTS
exports.getAllConsignments = async (req, res) =>{
    try {
        const consignments = await Consignment.findAll();

        return res.status(200).json({
            success: true,
            message: 'Consignments fetched successfully',
            count: consignments.length,
            data: consignments
        });
    } catch (err) {
        console.log('❌ Error fetching consignments:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

//3 GET CONSIGNMENTS BY STATUS
exports.getConsignmentsByStatus = async (req, res) => {
    try {
        const { status } = req.params;

        //Validate status
        const allowedStatus = ['Pending', 'Accepted', 'Rejected', 'Live', 'Completed'];
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                messgae: `Invalid status. Allowed values: ${allowedStatus.join(', ')}`
            });
        }

        const consignments = await Consignment.findAll({
            where: { status }
        });

        return res.status(200).json({
            success: true,
            message:  `Consignments with status '${status}' fetched successfully`,
            count: consignments.length,
            data: consignments
        })
    } catch (err) {
        console.error('❌ Error fetching consignments by status:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}