const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    name: String,
    image: String
})

exports.Order = mongoose.model('Order', orderSchema);