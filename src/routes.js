var express = require('express');
var router = express.Router();
var debug = require('debug')('API');

router.get('/', function (req, res, next) {
	res.render('index');
});

module.exports = router;
