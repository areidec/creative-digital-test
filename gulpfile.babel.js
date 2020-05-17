const gulp        = require('gulp');
const sync        = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const sass        = require('gulp-sass');
const concat      = require('gulp-concat');
const babel       = require('gulp-babel');
const cssbeautify = require('gulp-cssbeautify');

const watchSassFiles = 'src/sass/**/*.+(sass|scss)';
const watchJsFiles = ['src/js/**/*.js', '!js/libs/*.js'];
const watchHtmlFiles = ['src/**/*.html', '!node_modules/**/*.html'];

function browser() {
	sync.init({
		server: {
      baseDir: 'dist',
      index: 'index.html'
    },
		notify: false,
	});
}

function devSass() {
	return gulp
		.src(watchSassFiles)
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cssbeautify({ indent: '	' }))
		.pipe(gulp.dest('dist/css/'))
		.pipe(sync.stream());
}

function devJs() {
	return gulp
    .src(watchJsFiles)
    // .pipe(concat('main.js'))
    .pipe(babel({ 
      presets: ['@babel/preset-env']
     }))
    .pipe(gulp.dest('dist/js/'))
		.pipe(sync.reload({ stream: true }));
}

function devHtml() {
  return gulp.
    src(watchHtmlFiles)
    .pipe(gulp.dest('dist/'))
    .pipe(sync.reload({ stream: true }));
}

function assets() {
  return gulp.
    src('src/assets/**/*.*')
    .pipe(gulp.dest('dist/assets'))
    .pipe(sync.reload({ stream: true }));
}

function watcher() {
	gulp.watch(watchSassFiles, devSass);
	gulp.watch(watchJsFiles, devJs);
  gulp.watch(watchHtmlFiles, devHtml);
  gulp.watch('src/assets/**/*.*', assets);
}




exports.default = gulp.parallel(devSass, devJs, browser, watcher, assets);