const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    full_name: String,
    passport_number: String,
    contacts: {
        phone: String,
        email: String
    },
    visits: [{
        room_number: String,
        building_name: String,
        start_date: Date,
        end_date: Date,
        services_used: [String],
        complaints: [String],
        total_due: Number
    }]
});

module.exports = mongoose.model('Client', clientSchema);