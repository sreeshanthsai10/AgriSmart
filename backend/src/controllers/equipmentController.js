const Equipment = require('../models/Equipment');


// =========================
// ADD EQUIPMENT
// =========================
const addEquipment = async (req, res) => {
    try {
        const {
            name,
            category,
            description,
            pricePerDay,
            address,
            contactPhone
        } = req.body;

        if (!name || !category || !pricePerDay || !address) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        let newEquipment = {
            dealer: req.user._id,
            name,
            category,
            description,
            pricePerDay: Number(pricePerDay),
            address,
            contactPhone,
            isAvailable: true
        };

        //  IMAGE UPLOAD
        if (req.file) {
            newEquipment.image = `/uploads/${req.file.filename}`;
        }

        //  SAFE LOCATION (NO CRASH GUARANTEED)
        const latitude = Number(req.body.lat);
        const longitude = Number(req.body.lng);

        if (
            req.body.lat !== undefined &&
            req.body.lng !== undefined &&
            !isNaN(latitude) &&
            !isNaN(longitude)
        ) {
            newEquipment.location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        }

        const equipment = await Equipment.create(newEquipment);

        res.status(201).json({
            success: true,
            data: equipment
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



// =========================
// GET MY EQUIPMENT
// =========================
const getMyEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({ dealer: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: equipment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};



// =========================
// GET ALL EQUIPMENT (FARMER)
// =========================
const getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({ isAvailable: true })
            .populate('dealer', 'name phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: equipment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};



// =========================
// UPDATE EQUIPMENT
// =========================
const updateEquipment = async (req, res) => {
    try {
        let equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        // 🔒 OWNER CHECK
        if (
            equipment.dealer.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        let updateData = { ...req.body };

        //  FIX PRICE TYPE
        if (req.body.pricePerDay) {
            updateData.pricePerDay = Number(req.body.pricePerDay);
        }

        //  IMAGE UPDATE
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        //  SAFE LOCATION UPDATE
        const latitude = Number(req.body.lat);
        const longitude = Number(req.body.lng);

        if (
            req.body.lat !== undefined &&
            req.body.lng !== undefined &&
            !isNaN(latitude) &&
            !isNaN(longitude)
        ) {
            updateData.location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        } else {
            //  REMOVE INVALID LOCATION
            delete updateData.location;
        }

        equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: equipment
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



// =========================
// DELETE EQUIPMENT
// =========================
const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        if (
            equipment.dealer.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        await equipment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Equipment removed'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getNearbyEquipment = async (req, res) => {
    try {
        const { lat, lng } = req.query;

        // ❗ fallback if no location data
        const hasGeoData = await Equipment.findOne({
            location: { $exists: true }
        });

        if (!lat || !lng || !hasGeoData) {
            const all = await Equipment.find({ isAvailable: true })
                .populate('dealer', 'name phone');

            return res.json({
                success: true,
                data: all
            });
        }

        const equipment = await Equipment.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [Number(lng), Number(lat)]
                    },
                    $maxDistance: 50000
                }
            }
        });

        res.json({
            success: true,
            data: equipment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addEquipment,
    getMyEquipment,
    getAllEquipment,
    updateEquipment,
    deleteEquipment,
    getNearbyEquipment
};