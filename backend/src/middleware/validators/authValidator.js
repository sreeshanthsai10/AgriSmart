const { body } = require('express-validator');

// Register validation
exports.registerValidator = [
    body('name')
        .notEmpty()
        .withMessage('Name is required'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Valid email required'),

    body('phone')
        .optional()
        .isMobilePhone()
        .withMessage('Valid phone number required'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

// Login validation (FIXED)
exports.loginValidator = [
    body('identifier')
        .notEmpty()
        .withMessage('Email or phone is required'),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
];