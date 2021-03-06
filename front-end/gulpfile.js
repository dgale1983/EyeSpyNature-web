var config = require('./config.json');

var gulp = require('gulp'),
	fs = require('fs'),
	del = require('del'),
	path = require('path'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	gulpImports = require('gulp-imports'),
	clean = require('gulp-clean'),
	jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	sassGlob = require('gulp-sass-glob'),
	cssnano = require('gulp-cssnano'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	autoprefixer = require('gulp-autoprefixer'),
	svgstore = require('gulp-svgstore'),
	inject = require('gulp-inject'),
	imagemin = require('gulp-imagemin'),
	cheerio = require('gulp-cheerio'),
	plumber = require('gulp-plumber'),
	htmlhint = require('gulp-htmlhint'),
	twig = require('gulp-twig'),
	browserSync = require('browser-sync').create()


var buildOptions = {
		prod: gutil.env.prod, // use gulp --prod for minification
		sync: gutil.env.sync, // use gulp --sync for browsersync
	};

var onCompileError = function (err) {
	gutil.log(err);
	notify.onError({
		title: 'Gulp',
		subtitle: 'Compile Error!',
		message: '<%= error.message %>',
		sound: 'Beep'
	})(err);
	gutil.log(gutil.colors.red(err));
	// Keep gulp from hanging on this task
	if (typeof this.emit === 'function') this.emit('end')
};

var onJSHintError = function (err) {
	notify.onError({
		title: 'Gulp',
		subtitle: 'JS Error!',
		message: '<%= error.message %>',
		sound: 'Beep'
	})(err);
	// Keep gulp from hanging on this task
	if (typeof this.emit === 'function') this.emit('end')
};


gulp.task('clean', function () {
	return gulp.src(config.paths.base.dist, {read: false})
		.pipe(clean());
});

gulp.task('clean-scripts', function () {
	return gulp.src(config.paths.scripts.dist, {read: false})
		.pipe(clean());
});

gulp.task('clean-styles', function () {
	return gulp.src(config.paths.styles.dist, {read: false})
		.pipe(clean());
});

gulp.task('clean-images', function () {
	return gulp.src(config.paths.images.dist, {read: false})
		.pipe(clean());
});

gulp.task('clean-templates', function () {
	return gulp.src(config.paths.base.dist + '*.html', {read: false})
		.pipe(clean());
});


gulp.task('build-css', function () {
	return gulp.src(config.paths.styles.src + 'main.scss')
		.pipe(plumber({ errorHandler: onCompileError }))
		// Include sourcemaps if gulp runs with '--type prod'
		.pipe(gulpif(!buildOptions.prod, sourcemaps.init()))
		// allow @import "sections/*"; in main scss file rather than named imports
		.pipe(sassGlob())
		.pipe(sass())
		.pipe(autoprefixer({ browsers: ['> 1%', 'ios_saf 6', 'ie >= 9'], map: true }))
		// Minify if gulp runs with '--type prod'
		.pipe(gulpif(buildOptions.prod, cssnano({ autoprefixer: false })))
		.pipe(gulpif(!buildOptions.prod, sourcemaps.write()))
		.pipe(rename('styles.css'))
		.pipe(gulp.dest(config.paths.styles.dist))
		//.pipe(gulpif(!buildOptions.prod, browserSync.stream()))
		.pipe(notify('SASS Complete'));
});

gulp.task('jshint', function () {
    //return gulp.src(config.paths.scripts.src + 'components/**/*.js')
    return gulp.src(config.paths.scripts.src + 'components.js')
		.pipe(plumber({ errorHandler: onJSHintError }))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'))
		.on('error', notify.onError({ message: 'JS hint fail' }));
});

gulp.task('build-js-dependencies', function () {
	return gulp.src(config.paths.scripts.src + 'dependencies.js')
		.pipe(plumber({ errorHandler: onCompileError }))
		.pipe(sourcemaps.init())
		.pipe(gulpImports())
		.pipe(concat('dependencies.js'))
		// Uglify if gulp runs with '--prod'
		.pipe(gulpif(buildOptions.prod, uglify()))
		.pipe(gulpif(!buildOptions.prod, sourcemaps.write()))
		.pipe(gulp.dest(config.paths.scripts.dist))
		//.pipe(gulpif(!buildOptions.prod, browserSync.stream()))
		.pipe(notify('JS Dependencies Complete'));
});

gulp.task('build-js-components', function () {
	return gulp.src(config.paths.scripts.src + 'components.js')
		.pipe(plumber({ errorHandler: onCompileError }))
		.pipe(sourcemaps.init())
		.pipe(gulpImports())
		// Uglify if gulp runs with '--prod'
		.pipe(gulpif(buildOptions.prod, uglify()))
		.pipe(gulpif(!buildOptions.prod, sourcemaps.write()))
		.pipe(rename('scripts.js'))
		.pipe(gulp.dest(config.paths.scripts.dist))
		//.pipe(gulpif(!buildOptions.prod, browserSync.stream()))
		.pipe(notify('JS Components Complete'));
});

// Check HTML for any unmatched/unclosed tags
gulp.task('html-hint', function () {
	gulp.src(config.paths.templates.dist)
		.pipe(htmlhint({
			"tag-pair": true,
			"attr-lowercase": false,
			"attr-value-double-quotes": false,
			"attr-value-not-empty": false,
			"attr-no-duplication": false,
			"doctype-first": false,
			"tagname-lowercase": false,
			"tag-self-close": false,
			"spec-char-escape": false,
			"id-unique": false,
			"src-not-empty": false,
			"title-require": false
		}))
		.pipe(htmlhint.reporter())
})

// Optimise and copy Images from src to dist
gulp.task('imagemin', function () {
	return gulp.src(config.paths.images.src + '**/*.{jpg,png,gif,svg}')
		.on('error', onCompileError)
		.pipe(imagemin({
			progressive: true,
			interlaced: true,
			pngquant: true
		}))
		.pipe(gulp.dest(config.paths.images.dist))
		.pipe(notify('Images optimised'));
})

// Compile SVG symbols into a single file for includes
gulp.task('svgstore', ['imagemin'], function () {
	return gulp.src(config.paths.images.dist + 'svg/svg-symbols/*.svg')
		.on('error', onCompileError)
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(cheerio({
			run: function ($, file) {
				$('svg').attr({
					style: 'height: 0; width: 0; position: absolute; visibility: hidden;',
					tabindex: '-1'
				});
				$('symbol').attr('preserveAspectRatio', 'xMinYMin slice');
			},
			parserOptions: { xmlMode: true }
		}))
		.pipe(rename('svg-symbols.html'))
		.pipe(gulp.dest(config.paths.templates.src + 'snippets/'))
		.pipe(notify('SVG symbols compiled')); 
});

// Compile templates from src to dist
gulp.task('templates', ['imagemin', 'svgstore'], function () {
	return gulp.src(config.paths.templates.src + 'pages/*')
		.on('error', onCompileError)
		.pipe(twig())
		.on('error', onCompileError)
		// .pipe(rename('stylefile.html'))
		.pipe(gulp.dest(config.paths.templates.dist))
		.pipe(notify('Templates Complete'));
		//.pipe(gulpif(!buildOptions.prod, browserSync.stream()));
});

gulp.task('watch', function () {
	gulp.watch(config.paths.images.src + '**/*.{jpg, png, gif, svg}', ['imagemin']);
	// gulp.watch(config.paths.templates.src + '**/*.html', ['templates']);
	gulp.watch(config.paths.scripts.src + '**/*.js', ['jshint', 'build-js']);
	gulp.watch(config.paths.styles.src + '**/*.scss', ['build-css']);

	if (buildOptions.sync) {
		browserSync.init({
			open: true,
			server: './',
			// proxy: 'project.local'
			port: 8042,
			startPath: '/public/templates/index.html',
			ui: { port: 9042 }
		});
	}
})

var defaultTasks = [/*'imagemin', 'templates',*/ 'build-css', 'build-js'];
// Only watch when not using --prod
if (!buildOptions.prod) defaultTasks.push('watch');
//if (buildOptions.prod) defaultTasks.push('html-hint');

gulp.task('build-js', ['jshint', 'build-js-dependencies', 'build-js-components']);
gulp.task('default', defaultTasks);