const express = require('express');
const router = express.Router();

const {
    addEquipment,
    getMyEquipment,
    getAllEquipment,
    updateEquipment,
    deleteEquipment,
    getNearbyEquipment 
} = require('../controllers/equipmentController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');


// =========================
// DEALER ROUTES
// =========================

// Dealer's own equipment
router.get('/my', protect, authorize('dealer', 'admin'), getMyEquipment);

// Add equipment (WITH IMAGE)
router.post(
    '/',
    protect,
    authorize('dealer', 'admin'),
    upload.single('image'),
    addEquipment
);


router.put(
    '/:id',
    protect,
    authorize('dealer', 'admin'),
    upload.single('image'), 
    updateEquipment
);

// Delete equipment
router.delete('/:id', protect, authorize('dealer', 'admin'), deleteEquipment);


// =========================
// PUBLIC ROUTES (FARMERS)
// =========================

// Get all available equipment
router.get('/nearby', getNearbyEquipment);
router.get('/', getAllEquipment);


module.exports = router;