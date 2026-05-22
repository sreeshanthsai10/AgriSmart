const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default: ''
    },

    pricePerDay: {
        type: Number,
        required: true,
        min: 0
    },

    address: {
        type: String,
        required: true,
        trim: true
    },

    //  SAFE GEO LOCATION
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            validate: {
                validator: function (val) {
                    // allow undefined OR exactly 2 valid numbers
                    return (
                        !val ||
                        (Array.isArray(val) &&
                            val.length === 2 &&
                            !isNaN(val[0]) &&
                            !isNaN(val[1]))
                    );
                },
                message: 'Invalid coordinates'
            }
        }
    },

    //  IMAGE PATH
    image: {
        type: String,
        default: null
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    contactPhone: {
        type: String,
        trim: true
    }

}, { timestamps: true });


//  VERY IMPORTANT (for nearby search)
EquipmentSchema.index({ location: '2dsphere' });


module.exports = mongoose.model('Equipment', EquipmentSchema);