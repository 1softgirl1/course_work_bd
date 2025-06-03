const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: String,
    type: String,
    contract: {
        start: Date,
        end: Date,
        discount_percent: Number,
        special_conditions: String
    },
    booking_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    }]
});

module.exports = mongoose.model('Company', companySchema);