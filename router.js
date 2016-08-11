let express  = require('express'),
	router   = express.Router();

router.get('/im', function(req, res) {
	global.user = req.query.user;
    res.render('index', { username: req.query.user });
});
	
module.exports = router;