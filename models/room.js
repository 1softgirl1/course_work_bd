const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    number: String,
    floor: Number,
    capacity: Number,
    status: String,
    price_per_night: Number,
    building: {
        name: String,
        stars: Number,
        floors: Number,
        rooms_total: Number,
        rooms_per_floor: Number,
        amenities: [String]
    },
    amenities: [String],
    next_booking_date: Date
});

module.exports = mongoose.model('Room', roomSchema);