const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    hotel_class: Number,
    floor: Number,
    rooms_reserved: Number,
    people_count: Number,
    start_date: Date,
    end_date: Date,
    canceled: Boolean,
    rooms_numbers: [String]
});

module.exports = mongoose.model('Booking', bookingSchema);