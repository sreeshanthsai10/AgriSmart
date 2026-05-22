const mongoose = require('mongoose');

const ServiceRequestSchema = new mongoose.Schema(
{
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },

    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    farmAddress: {
        type: String,
        required: [true, 'Please provide your farm address'],
        trim: true
    },

    requestedDate: {
        type: Date,
        required: [true, 'Please provide requested date']
    },

    durationDays: {
        type: Number,
        required: [true, 'Please provide duration in days'],
        min: [1, 'Duration must be at least 1 day']
    },

    message: {
        type: String,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },

    totalAmount: {
        type: Number,
        default: 0
    }

},
{ timestamps: true }
);


// =========================
//  INDEXES (IMPORTANT)
// =========================
ServiceRequestSchema.index({ dealer: 1 });
ServiceRequestSchema.index({ farmer: 1 });
ServiceRequestSchema.index({ equipment: 1 });


// =========================
//  PRE-SAVE VALIDATION
// =========================
ServiceRequestSchema.pre('save', function(next) {

    //  Prevent past date
    const today = new Date();
    today.setHours(0,0,0,0);

    if (this.requestedDate < today) {
        return next(new Error('Requested date cannot be in the past'));
    }

    next();
});

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);