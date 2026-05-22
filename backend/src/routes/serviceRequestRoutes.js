const express = require('express');
const router = express.Router();

const {
    createRequest,
    getMyRequests,
    getDealerRequests,
    updateRequestStatus
} = require('../controllers/serviceRequestController');

const { protect, authorize } = require('../middleware/auth');


// =========================
// FARMER ROUTES
// =========================

// Create request
// POST /api/v1/service-requests
router.post(
    '/',
    protect,
    authorize('farmer'),
    createRequest
);

// Get farmer requests
// GET /api/v1/service-requests/my
router.get(
    '/my',
    protect,
    authorize('farmer'),
    getMyRequests
);


// =========================
// DEALER ROUTES
// =========================

// Get dealer requests
// GET /api/v1/service-requests/dealer
router.get(
    '/dealer',
    protect,
    authorize('dealer', 'admin'),
    getDealerRequests
);

// Update request status
// PUT /api/v1/service-requests/:id/status
router.put(
    '/:id/status',
    protect,
    authorize('dealer', 'admin'),
    updateRequestStatus
);


// =========================
// OPTIONAL SAFETY (INVALID ROUTES)
// =========================
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Service request route not found'
    });
});


module.exports = router;