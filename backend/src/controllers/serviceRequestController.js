const ServiceRequest = require('../models/ServiceRequest');
const Equipment = require('../models/Equipment');


// =========================
// CREATE REQUEST
// =========================
const createRequest = async (req, res) => {
    try {
        const { equipmentId, farmAddress, requestedDate, durationDays, message } = req.body;

        if (!equipmentId || !farmAddress || !requestedDate || !durationDays) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const reqDate = new Date(requestedDate);
        const days = Number(durationDays);

        if (isNaN(reqDate) || isNaN(days) || days <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date or duration'
            });
        }

        const equipment = await Equipment.findById(equipmentId);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        if (!equipment.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Equipment is not available'
            });
        }

        //  Prevent duplicate pending request
        const existingPending = await ServiceRequest.findOne({
            equipment: equipmentId,
            farmer: req.user._id,
            status: 'pending'
        });

        if (existingPending) {
            return res.status(400).json({
                success: false,
                message: 'You already requested this equipment'
            });
        }

        //  Check overlapping accepted bookings
        const endDate = new Date(reqDate);
        endDate.setDate(endDate.getDate() + days);

        const overlapping = await ServiceRequest.findOne({
            equipment: equipmentId,
            status: 'accepted',
            requestedDate: {
                $lt: endDate
            }
        });

        if (overlapping) {
            return res.status(400).json({
                success: false,
                message: 'Equipment already booked for selected dates'
            });
        }

        const totalAmount = equipment.pricePerDay * days;

        const serviceRequest = await ServiceRequest.create({
            farmer: req.user._id,
            equipment: equipmentId,
            dealer: equipment.dealer,
            farmAddress,
            requestedDate: reqDate,
            durationDays: days,
            message,
            totalAmount
        });

        const populated = await serviceRequest.populate([
            { path: 'equipment', select: 'name category pricePerDay image' },
            { path: 'dealer', select: 'name email phone' }
        ]);

        res.status(201).json({
            success: true,
            data: populated
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



// =========================
// FARMER REQUESTS
// =========================
const getMyRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ farmer: req.user._id })
            .populate('equipment', 'name category image')
            .populate('dealer', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};



// =========================
// DEALER REQUESTS
// =========================
const getDealerRequests = async (req, res) => {
    try {
        const query = req.user.role === 'admin'
            ? {}
            : { dealer: req.user._id };

        const requests = await ServiceRequest.find(query)
            .populate('equipment', 'name category')
            .populate('farmer', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};



// =========================
// UPDATE STATUS
// =========================
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = ['pending', 'accepted', 'rejected', 'completed'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const request = await ServiceRequest.findById(req.params.id)
            .populate('equipment');

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        if (
            request.dealer.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        request.status = status;
        await request.save();

        //  LOCK equipment when accepted
        if (status === 'accepted') {
            await Equipment.findByIdAndUpdate(
                request.equipment._id,
                { isAvailable: false }
            );
        }

        //  UNLOCK on completion
        if (status === 'completed') {
            await Equipment.findByIdAndUpdate(
                request.equipment._id,
                { isAvailable: true }
            );
        }

        res.status(200).json({
            success: true,
            data: request
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createRequest,
    getMyRequests,
    getDealerRequests,
    updateRequestStatus
};