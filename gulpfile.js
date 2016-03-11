'use strict';

/**
 * Configuration
 */
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
      pattern: ['*']
    });

var browserSyncInstance = $.browserSync.create();
var config = {
  buildRoot: './build/',
  srcRoot: './src/',
  proxyAdress: 'http://carty.dev/',
  vendorCSS: [
    './node_modules/reset.css/reset.css',
  ],
  vendorFonts: [
  ]
};

var plumberErrorHandler = function (error) {
  console.log(error.toString());
  $.notify.onError({
    title:    "Build error",
    message:  "Plugin: <%= error.plugin %>"
  })(error);
  this.emit('end');
};

$.hbsfy.configure({
  extensions: ["hbs"]
});
/**
 * Configuration
 */

gulp.task('browserSync', function(cb) {
  browserSyncInstance.init({
    proxy: config.proxyAdress,
    open: false,
    notify: false,
    ghostMode: false
  }, cb);
});

gulp.task('php', function() {
  return gulp.src(config.srcRoot + '**/[^!]*.php')
    .pipe($.plumber({
        errorHandler: plumberErrorHandler
    }))
    .pipe($.htmlmin({
      collapseWhitespace: true
      }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('php-watch', ['php'], function () {
  browserSyncInstance.reload();
});


gulp.task('html', function() {
  return gulp.src(config.srcRoot + '**/[^!]*.html')
    .pipe($.plumber({
        errorHandler: plumberErrorHandler
    }))
    .pipe($.htmlmin({
      collapseWhitespace: true
      }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('html-watch', ['html'], function () {
  browserSyncInstance.reload();
});


gulp.task('fonts', function() {
  return gulp.src(config.vendorFonts)
    .pipe($.plumber({
        errorHandler: plumberErrorHandler
    }))
    .pipe(gulp.dest(config.buildRoot + 'fonts/'));
});

gulp.task('json', function() {
  return gulp.src(config.srcRoot + '**/[^!]*.json')
    .pipe($.plumber({
        errorHandler: plumberErrorHandler
    }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('json-watch', ['json'], function () {
  browserSyncInstance.reload();
});

gulp.task('js', function() {
  return $.browserify(config.srcRoot + 'js/app.js')
    .transform($.babelify)
    .transform($.hbsfy)
    .bundle()
    .pipe($.vinylSourceStream('bundle.min.js'))
    .pipe($.vinylBuffer())
    .pipe($.uglify())
    .pipe(gulp.dest(config.buildRoot + 'js/'));
});

gulp.task('js-watch', ['js'], function () {
  browserSyncInstance.reload();
});

gulp.task('handlebars-watch', ['js'], function () {
  browserSyncInstance.reload();
});

gulp.task('css', function() {
  return gulp.src(config.vendorCSS)
    .pipe($.plumber({
        errorHandler: plumberErrorHandler
    }))
    .pipe($.concat('vendor.min.css'))
    .pipe($.postcss([
      $.cssnano({safe: true})
    ]))
    .pipe(gulp.dest(config.buildRoot + 'css/'));
});

gulp.task('stylus', function() {
  return gulp.src(config.srcRoot + 'styles/bundle.styl')
    .pipe($.plumber({
        errorHandler: plumberErrorHandler
    }))
    .pipe($.stylus())
    .pipe($.concat('bundle.min.css'))
    .pipe($.postcss([
      $.autoprefixer({browsers: ['last 2 versions']}),
      $.cssnano({safe: true})
    ]))
    .pipe(gulp.dest(config.buildRoot + 'css/'))
    .pipe(browserSyncInstance.stream());
});

gulp.task('jade', function() {
  gulp.src('./src/**.jade')
    .pipe($.plumber({
          errorHandler: plumberErrorHandler
      }))
    .pipe($.jade())
    .pipe(gulp.dest('./build/'))
});

gulp.task('jade-watch', ['jade'], function () {
  browserSyncInstance.reload();
});

gulp.task('imageOptim', function () {
  return gulp.src(config.srcRoot + 'images/**/*')
    .pipe($.plumber({
        errorHandler: plumberErrorHandler
    }))
    .pipe($.imagemin({
      progressive: true,
      }))
    .pipe(gulp.dest(config.buildRoot + 'images/'));
});

gulp.task('photos', function () {
  return gulp.src(config.srcRoot + 'photo/**/*')
    .pipe($.plumber({
        errorHandler: plumberErrorHandler
    }))
    .pipe(gulp.dest(config.buildRoot + 'photo/'));
});

/**
 * Task: Watch
 */
gulp.task('watch', ['browserSync'], function() {
  // gulp.watch(config.srcRoot + '**/[^!]*.php', ['php-watch']);
  // gulp.watch(config.srcRoot + '**/[^!]*.html', ['html-watch']);
  gulp.watch(config.srcRoot + 'data/**/[^!]*.json', ['json-watch']);
  gulp.watch(config.srcRoot + '**/[^!]*.jade', ['jade-watch']);
  gulp.watch(config.srcRoot + 'js/**/[^!]*.js', ['js-watch']);
  gulp.watch(config.srcRoot + 'templates/**/[^!]*.hbs', ['handlebars-watch']);
  gulp.watch(config.srcRoot + 'styles/**/[^!]*.styl', ['stylus']);
});

/**
 * Task: Clean
 */
gulp.task('clean', function (cb) {
  $.del.sync(config.buildRoot + '*');
  cb();
});

/**
 * Task: Build
 */
gulp.task('build', function (cb) {
  $.runSequence('clean', [
    'jade',
    // 'photos',
    'imageOptim',
    'stylus',
    'css',
    'js',
    'json',
    'html',
    // 'php',
    // 'fonts',
    ], cb);
});

/**
 * Task: Deploy
 *
 * //ftp_config.json
 *  {
 *    "host": "example.com",
 *    "user": "user",
 *    "pass": "password",
 *    "remotePath": "/.../"
 *  }
 */
gulp.task('deploy', function () {
  var ftpConfig = require('./ftp_config.json')

  var conn = $.vinylFtp.create( {
      host: ftpConfig.host,
      user: ftpConfig.user,
      password: ftpConfig.pass,
  } );

  return gulp.src(config.buildRoot + '/**/*', {buffer: false })
      .pipe(conn.dest(ftpConfig.remotePath));
});

/**
 * Task: Serve
 */
gulp.task('serve', ['watch']);
