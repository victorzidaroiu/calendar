var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	name: String,
	category: String,
	locationID: String
});

var productsModel = mongoose.model('Products', schema);
//populate products
productsModel.find({}, function (err, data) {
	if (!err) {
		if (data.length === 0) {
			productsModel.create({name: 'Arsenal TV', category: 'Sports', locationID: 'LONDON'});
			productsModel.create({name: 'Chelsea TV', category: 'Sports', locationID: 'LONDON'});
			productsModel.create({name: 'Liverpool TV', category: 'Sports', locationID: 'LIVERPOOL'});
			productsModel.create({name: 'Sky News', category: 'News', locationID: ''});
			productsModel.create({name: 'Sky Sports News', category: 'News', locationID: ''});
		}
	}
});

module.exports = productsModel;