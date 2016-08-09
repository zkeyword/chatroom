let express = require('express'),
	router = express.Router()

router.get('/', function(req, res) {
	console.log(12121212)
    res.render('index', { title: 'index' });
});
	
module.exports = router;