var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	locationID: String,
	basket: {}
});

module.exports = mongoose.model('Customers', schema);