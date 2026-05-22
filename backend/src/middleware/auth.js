const jwt = require('jsonwebtoken');
const User = require('../models/User');


// =========================
// PROTECT MIDDLEWARE
// =========================
const protect = async (req, res, next) => {
    let token;

    try {
        //  Extract token safely
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }

        //  Check secret exists
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'JWT secret not configured'
            });
        }

        //  Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //  Get user
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};


// =========================
// AUTHORIZE ROLES
// =========================
const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not allowed`
            });
        }

        next();
    };
};


module.exports = { protect, authorize };