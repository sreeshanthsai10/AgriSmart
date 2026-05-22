
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// 📦 Send response
const sendResponse = (res, statusCode, user) => {
    res.status(statusCode).json({
        success: true,
        token: generateToken(user._id),
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    });
};

// =========================
// 🚀 REGISTER (Email OR Phone)
// =========================
const register = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !password || (!email && !phone)) {
            res.status(400);
            throw new Error('Name, password and email or phone are required');
        }

        const userExists = await User.findOne({
            $or: [
                email ? { email } : null,
                phone ? { phone } : null
            ].filter(Boolean)
        });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: 'customer'
        });

        sendResponse(res, 201, user);

    } catch (error) {
        next(error);
    }
};

// =========================
// 🔐 LOGIN (Email OR Phone)
// =========================
const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            res.status(400);
            throw new Error('Provide email/phone and password');
        }

        const query = identifier.includes('@')
            ? { email: identifier }
            : { phone: identifier };

        const user = await User.findOne(query).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        sendResponse(res, 200, user);

    } catch (error) {
        next(error);
    }
};

// =========================
// 👤 GET CURRENT USER
// =========================
const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe
};