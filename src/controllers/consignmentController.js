const Consignment = require('../models/consignment');
// const Shipment = require('../models/shipment');

//1 CREATE CONSIGNMENT
exports.createConsignment = async (req, res) => {
    try {

        // Only allow users with transporter role to create consignments
        if(req.user.userType !== 'transporter') {
            return res.status(403).json({
                success: false,
                message: 'Only transporters can create consignments'
            });
        }

        // Extract feilds from req body
        const{
            shipmentId, 
            source,
            destination 
        } = req.body;

        // Extract transporterId from JWT (req.user)
        const transporterId= req.user.transporterId 

        //1 Validate feilds
        if(!shipmentId  || !transporterId || !source || !destination){
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: shipmentId, transporterId, source, or destination'
            });
        }

        const shipment = await Shipment.findByPk(shipmentId);
        if (!shipment) {
            return res.status(404).json({
                success: false,
                message: 'Shipment not found'
            });
        }
        //6 Create the consignment (default status to 'pending')
        const newConsignment = await Consignment.create({
            shipmentId,
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