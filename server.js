let fs       = require('fs');
let path     = require('path');
let express  = require('express');
let app      = express();
let ejs      = require('ejs');
let favicon  = require('serve-favicon');
let router   = require('./router.js');
let imServer = require('./lib/chat_server.js');

/* express中间件 */ 
let logger       = require('morgan');
let bodyParser   = require('body-parser');

/* 这种模板引擎 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', ejs.__express);

/* post参数的解析 */ 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* 日志 */
let accessLog = fs.createWriteStream('log/access.log', {flags: 'a'});
app.use(logger('dev'));
app.use(logger({stream: accessLog}));	

/* 设定静态文件目录 */
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

/* 添加路由 */
app.use(router);

/* 监听端口并启用 */
let server = app.listen(3000);
imServer.listen( server );