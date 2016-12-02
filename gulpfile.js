var async = require('async');
var gulp = require('gulp');
var download = require('gulp-download');
var decompress = require('gulp-decompress');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var fs = require('fs');
var browserSync = require('browser-sync').create();

gulp.task('getsrc', function () {
	download('https://github.com/omise/banks-logo/archive/master.zip')
		.pipe(decompress({
			strip: 1
		}))
		.pipe(gulp.dest('src/'));
});

gulp.task('genColors', function () {
	var sources = require('./src/banks.json');
	var banks = sources.th;
	var css = "";

	for (var bank in banks) {
		// skip loop if the property is from prototype
		if (!banks.hasOwnProperty(bank)) continue;
		var obj = banks[bank];
		css += '.thbanks-' + bank + '{background-color:' + obj['color'] + '}';
	}

	// create stylesheet
	fs.writeFileSync('dist/css/thbanklogos-colors.css', css);
});

gulp.task('genFontsCSS', function (done) {
	var iconStream = gulp.src(['src/th/*.svg'])
		.pipe(iconfont({
			fontName: 'thbanks'
		}));

	async.parallel([
		function handleGlyphs(cb) {
			iconStream.on('glyphs', function (glyphs, options) {
				gulp.src('templates/thbanklogos.css')
					.pipe(consolidate('lodash', {
						glyphs: glyphs,
						fontName: 'thbanks',
						fontPath: '../fonts/',
						className: 'thbanks'
					}))
					.pipe(gulp.dest('dist/css/'))
					.on('finish', cb);
			});
		},
		function handleFonts(cb) {
			iconStream
				.pipe(gulp.dest('dist/fonts/'))
				.on('finish', cb);
		}
	], done);
});

gulp.task('serve', function() {
	browserSync.init({
		server: {
			baseDir: './'
		}
	});
	gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('default', [], function () {
	gulp.src(['dist/css/thbanklogos.css', 'dist/css/thbanklogos-colors.css'])
		.pipe(concat('thbanklogos.min.css'))
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(gulp.dest('dist/css/'));
});