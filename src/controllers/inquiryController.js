const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const axios = require("axios");
const { sendEmail } = require('../utils/helperUtils');
const columns = [
    'name',
    'companyName',
    'phone',
    'gst',
    'pickupLocation',
    'pickupAddressLine1',
    'pickupAddressLine2',
    'pickupPincode',
    'dropLocation',
    'dropAddressLine1',
    'dropAddressLine2',
    'dropPincode',
    'materialType',
    'weight',
    'length',
    'width',
    'height',
    'expectedPickup',
    'expectedDelivery',
    'transportMode',
    'shipmentType',
    'materialValue',
    'ebayBill',
    'customMaterialType',
    'coolingType',
    'truckSize',
    'manpower',
    'distance',
    'submittedAt'
];


async function getDistance(pickupAddress, dropAddress) {
    const MAPBOX_TOKEN = process.env.MAPBOX_API_KEY;

    try {
        const pickupGeo = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(pickupAddress)}.json`, {
            params: { access_token: MAPBOX_TOKEN }
        });
        const [pickupLng, pickupLat] = pickupGeo.data.features[0].center;

        const dropGeo = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(dropAddress)}.json`, {
            params: { access_token: MAPBOX_TOKEN }
        });

        const [dropLng, dropLat] = dropGeo.data.features[0].center;

        const directions = await axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${pickupLng},${pickupLat};${dropLng},${dropLat}`, {
            params: { access_token: MAPBOX_TOKEN, overview: "false" }
        });

        const distanceMeters = directions.data.routes[0].distance;
        const distanceKm = (distanceMeters / 1000).toFixed(2);

        return `${distanceKm} km`;
    } catch (err) {
        console.error("Error fetching distance:", err.message);
        return "Distance not available";
    }
}

exports.inquiryForm = async (req, res) => {
    try {
        const formData = req.body;

        console.log("form data ", formData);

        const reportData = {};
        columns.forEach(col => {
            reportData[col] = req.body[col] !== undefined ? req.body[col] : '';
        });
        reportData.distance = await getDistance(
            `${reportData.pickupLocation}, ${reportData.pickupAddressLine1}, ${reportData.pickupAddressLine2}, ${reportData.pickupPincode}`,
            `${reportData.dropLocation}, ${reportData.dropAddressLine1}, ${reportData.dropAddressLine2}, ${reportData.dropPincode}`
        );
        reportData.submittedAt = new Date().toISOString();

        //2 Create Excel file


        const filePath = path.join(__dirname, '../temp', 'all_inquiries.xlsx');
        const workbook = new ExcelJS.Workbook();
        let worksheet;

        if (fs.existsSync(filePath)) {
            // Load the existing workbook
            await workbook.xlsx.readFile(filePath);
            worksheet = workbook.getWorksheet('Inquiries');

            // If no sheet found, create it
            if (!worksheet) {
                worksheet = workbook.addWorksheet('Inquiries');
                worksheet.columns = columns.map(key => ({
                    header: key,
                    key: key,
                    width: 25
                }));
            } else {
                // Ensure columns exist even if file was made earlier
                worksheet.columns = columns.map(key => ({
                    header: key,
                    key: key,
                    width: 25
                }));
            }
}

            // Append the new row at the end
            worksheet.addRow(reportData);

            // Save the file back
            await workbook.xlsx.writeFile(filePath);


            //3 Send email

            // Prepare a text version of the report
            const reportText = Object.entries(reportData)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');

            console.log(" report data : ", reportData);

            await sendEmail({
                to: "vivi@example.com",
                subject: `New Form Submission #${formData.name}`,
                html: `
                    <h3>New Inquiry Form Submission</h3>
                    <pre>${reportText}</pre>
                `
            });

            res.status(201).json({
                success: true,
                message: 'Inquiry added to Excel and emailed successfully.',
                data: reportData
            });

        } catch (error) {
            console.error('Error submitting form: ', error);
            res.status(500).json({
                success: false,
                message: 'Error submitting form',
                error: error.message
            })
        }
    }