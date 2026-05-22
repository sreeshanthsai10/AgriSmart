const Farm = require('../models/Farm');

// @desc Create farm
const createFarm = async (req, res, next) => {
    try {
        // Force owner (prevent injection)
        const data = {
            ...req.body,
            owner: req.user._id,
            image: req.file ? req.file.filename : null
        };

        const farm = await Farm.create(data);

        res.status(201).json({
            success: true,
            farm
        });

    } catch (error) {
        next(error);
    }
};

// @desc Get my farms
const getMyFarms = async (req, res, next) => {
    try {
        const farms = await Farm.find({ owner: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: farms.length,
            farms
        });

    } catch (error) {
        next(error);
    }
};

// @desc Get single farm
const getFarm = async (req, res, next) => {
    try {
        const farm = await Farm.findById(req.params.id)
            .populate('owner', 'name email');

        if (!farm) {
            res.status(404);
            throw new Error('Farm not found');
        }

        if (
            farm.owner._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            res.status(403);
            throw new Error('Not authorized to view this farm');
        }

        res.status(200).json({
            success: true,
            farm
        });

    } catch (error) {
        next(error);
    }
};

// @desc Update farm
const updateFarm = async (req, res, next) => {
    try {
        let farm = await Farm.findById(req.params.id);

        if (!farm) {
            res.status(404);
            throw new Error('Farm not found');
        }

        if (
            farm.owner.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            res.status(403);
            throw new Error('Not authorized to update this farm');
        }

        // Prevent owner change
        delete req.body.owner;

        farm = await Farm.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            farm
        });

    } catch (error) {
        next(error);
    }
};

// @desc Delete farm
const deleteFarm = async (req, res, next) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (!farm) {
            res.status(404);
            throw new Error('Farm not found');
        }

        if (
            farm.owner.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            res.status(403);
            throw new Error('Not authorized to delete this farm');
        }

        await farm.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Farm deleted'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFarm,
    getMyFarms,
    getFarm,
    updateFarm,
    deleteFarm
};