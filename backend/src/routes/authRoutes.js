const express = require('express');
const router = express.Router();

const {
    register,
    login,
    getMe
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { registerValidator, loginValidator } = require('../middleware/validators/authValidator');
const validate = require('../middleware/validate');

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
// Public routes
// router.post('/register', register);
// router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;