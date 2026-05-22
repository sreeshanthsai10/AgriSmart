const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        name: {
            type: String,
            required: [true, 'Please provide a farm name'],
            trim: true,
            maxlength: [100, 'Name too long']
        },
        cropType: {
            type: String,
            required: [true, 'Please specify the crop type'],
            trim: true,
            lowercase: true //  normalize data
        },
        area: {
            type: Number,
            required: [true, 'Please provide the farm area in acres'],
            min: [0.1, 'Area must be positive']
        },
        soilType: {
            type: String,
            enum: ['clay', 'sandy', 'loamy', 'silt', 'peat', 'chalk'],
            default: 'loamy'
        },
        image: {
            type: String,
            default: null
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                validate: {
                    validator: function (val) {
                        return val.length === 2 &&
                               val[0] >= -180 && val[0] <= 180 &&
                               val[1] >= -90 && val[1] <= 90;
                    },
                    message: 'Coordinates must be [lng, lat]'
                },
                required: true //  force real location
            },
            address: {
                type: String,
                trim: true
            }
        },
        irrigationType: {
            type: String,
            enum: ['drip', 'sprinkler', 'flood', 'rainfed'],
            default: 'rainfed'
        },
        notes: {
            type: String,
            maxlength: [1000, 'Notes cannot be more than 1000 characters']
        }
    },
    { timestamps: true }
);

//  Geospatial index
FarmSchema.index({ location: '2dsphere' });

//  Query optimization
FarmSchema.index({ owner: 1 });
FarmSchema.index({ cropType: 1 });

module.exports = mongoose.model('Farm', FarmSchema);