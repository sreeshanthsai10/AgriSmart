const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters']
        },

        email: {
            type: String,
            unique: true,
            sparse: true, //  allows null values
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email'
            ]
        },

        phone: {
            type: String,
            unique: true,
            sparse: true, //  allows null values
            match: [/^[0-9]{10}$/, 'Please provide a valid phone number']
        },

        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },

        role: {
            type: String,
            enum: ['farmer', 'customer', 'dealer', 'admin'],
            default: 'customer'
        },

        avatar: {
            type: String,
            default: null
        },

        language: {
            type: String,
            enum: ['en', 'hi', 'te'],
            default: 'en'
        }
    },
    { timestamps: true }
);

//  Ensure at least one: email OR phone
UserSchema.pre('validate', function (next) {
    if (!this.email && !this.phone) {
        next(new Error('Either email or phone is required'));
    } else {
        next();
    }
});

//  Hash password
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

//  Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//  Remove sensitive fields
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', UserSchema);