const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema(
{
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        street: String,
        city: String,
        state: String
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        }
    },

    phone: String,

    isActive: {
        type: Boolean,
        default: true
    },

    //  ADD THIS BACK
    inventory: [
        {
            name: { type: String, trim: true },
            price: Number,
            unit: { type: String, default: 'kg' },
            quantity: { type: Number, default: 0 }
        }
    ]

},
{ timestamps: true }
);

StoreSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Store', StoreSchema);