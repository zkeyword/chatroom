var gulp    = require('gulp'),
	nodemon = require('gulp-nodemon')
	
	
gulp.task('default', function(){
	nodemon({
		script: 'server.js'
	});
});