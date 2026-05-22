const express = require('express');
const router = express.Router();

const {
    createFarm,
    getMyFarms,
    getFarm,
    updateFarm,
    deleteFarm
} = require('../controllers/farmController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
// Create farm
router.post(
    '/',
    protect,
    authorize('farmer', 'admin'),
    upload.single('image'), 
    createFarm
);

// Get logged-in user's farms
router.get(
    '/mine',
    protect,
    authorize('farmer', 'admin'),
    getMyFarms
);

// Get single farm
router.get('/:id', protect, getFarm);

// Update farm
router.put(
    '/:id',
    protect,
    authorize('farmer', 'admin'),
    updateFarm
);

// Delete farm
router.delete(
    '/:id',
    protect,
    authorize('farmer', 'admin'),
    deleteFarm
);

module.exports = router;