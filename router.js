let express  = require('express'),
	router   = express.Router(),
	imServer = require('./lib/chat_server.js');

router.get('/', function(req, res) {
    res.render('index', { title: 'index' });
});

router.get('/im', function(req, res) {
	imServer.start( global.io );
    res.render('index', { title: 'index' });
});
	
module.exports = router;