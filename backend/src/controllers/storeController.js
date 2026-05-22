const Store = require('../models/Store');

// @desc    Create or update my store
// @route   POST /api/stores
// @access  Private (Farmer)
const createStore = async (req, res, next) => {
    try {
        req.body.owner = req.user._id;

        //  CLEAN INVENTORY BEFORE SAVE
        if (req.body.inventory && Array.isArray(req.body.inventory)) {
            req.body.inventory = req.body.inventory
                .filter(item => item.name && item.price) // remove empty rows
                .map(item => ({
                    name: item.name.trim(),
                    price: Number(item.price),
                    unit: item.unit || 'kg',
                    quantity: Number(item.quantity) || 0
                }));
        }

        const store = await Store.findOneAndUpdate(
            { owner: req.user._id },
            req.body,
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({ success: true, store });

    } catch (error) {
        next(error);
    }
};

// @desc    Get my store profile
// @route   GET /api/stores/my
// @access  Private (Farmer)
const getMyStore = async (req, res, next) => {
    try {
        const store = await Store.findOne({ owner: req.user._id }).populate('owner', 'name email phone');
        if (!store) {
            return res.status(404).json({ success: false, message: 'You have not set up a store yet' });
        }
        res.status(200).json({ success: true, store });
    } catch (error) {
        next(error);
    }
};

// @desc    Get nearby stores using geospatial query
// @route   GET /api/stores/nearby?lat=XX&lng=XX&radius=5000
// @access  Public
const getNearbyStores = async (req, res, next) => {
    try {
        const { lat, lng, radius = 10000 } = req.query; // radius in meters, default 10km

        if (!lat || !lng) {
            return res.status(400).json({ success: false, message: 'Please provide lat and lng query parameters' });
        }

        const stores = await Store.find({
            isActive: true,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        }).populate('owner', 'name phone');

        res.status(200).json({ success: true, count: stores.length, stores });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all stores (public listing, paginated)
// @route   GET /api/stores
// @access  Public
const getAllStores = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await Store.countDocuments({ isActive: true });
        const stores = await Store.find({ isActive: true })
            .populate('owner', 'name phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ success: true, count: stores.length, total, stores });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a store
// @route   DELETE /api/stores/:id
// @access  Private (Owner or Admin)
const deleteStore = async (req, res, next) => {
    try {
        const store = await Store.findById(req.params.id);
        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }
        if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this store' });
        }
        await store.deleteOne();
        res.status(200).json({ success: true, message: 'Store deleted' });
    } catch (error) {
        next(error);
    }
};

module.exports = { createStore, getMyStore, getNearbyStores, getAllStores, deleteStore };
