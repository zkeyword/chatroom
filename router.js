let express  = require('express'),
	router   = express.Router();
	
router.get('/', function(req, res) {
	res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
	res.write("还没登录");
	res.end();
});

router.get('/im', function(req, res) {
	if( !req.session.user ) return res.redirect('/');
	global.userInfo = req.query;
	global.userInfo.user = req.session.user;
    res.render('index', { username: req.session.user });
});

router.get('/login', function(req, res) {
	res.render('login');
});

router.post('/login', function(req, res) {
	req.session.user = req.body.username;
	console.log( req.body )
	res.write("登录成功");
	res.end();
});


router.get('/Logout', function(req, res) {
	req.session.destroy();
	res.write("登出成功");
	res.end();
});
	
module.exports = router;