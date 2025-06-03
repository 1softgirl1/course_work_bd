const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    date: Date,
    amount: Number,
    description: [String]
});

module.exports = mongoose.model('Payment', paymentSchema);