'use strict';

/**
 * Configuration
 */
import gulp from'gulp';
import loadPlugins from 'gulp-load-plugins';

const $ = loadPlugins({pattern: ['*']});

const browserSyncInstance = $.browserSync.create();
const browserSyncReload = () => browserSyncInstance.reload();

const config = {
  buildRoot: './build/',
  srcRoot: './src/',
  proxyAdress: 'http://hamper.dev/',
  vendorCSS: [],
  vendorFonts: [],
};

$.hbsfy.configure({
  extensions: ['hbs'],
});

const plumberErrorHandler = function peh(error) {
  console.log(error.toString());

  $.notify.onError({
    title: 'Build error',
    message: 'Plugin: <%= error.plugin %>',
  })(error);

  this.emit('end');
};

/**
 * Task: BrowserSync
 */
gulp.task('browserSync', (cb) => {
  browserSyncInstance.init({
    proxy: config.proxyAdress,
    open: false,
    notify: false,
    ghostMode: false,
  }, cb);
});

/**
 * Task: PHP
 */
gulp.task('php', () => {
  return gulp.src(config.srcRoot + '**/[^!]*.php')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe($.htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest(config.buildRoot));
});

/**
 * Task-Watch: PHP
 */
gulp.task('php-watch', ['php'], browserSyncReload);

/**
 * Task: HTML
 */
gulp.task('html', () => {
  return gulp.src(config.srcRoot + '**/[^!]*.html')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe($.htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(gulp.dest(config.buildRoot));
});

/**
 * Task-Watch: HTML
 */
gulp.task('html-watch', ['html'], browserSyncReload);

/**
 * Task: Fonts
 */
gulp.task('fonts', () => {
  return gulp.src(config.vendorFonts)
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe(gulp.dest(config.buildRoot + 'fonts/'));
});

/**
 * Task: JSON
 */
gulp.task('json', () => {
  return gulp.src(config.srcRoot + '**/[^!]*.json')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe(gulp.dest(config.buildRoot));
});

gulp.task('json-watch', ['json'], browserSyncReload);

/**
 * Task: JavaScript
 */
gulp.task('js', () => {
  return $.browserify(config.srcRoot + 'js/app.js')
    .transform($.babelify)
    .transform($.hbsfy)
    .bundle()
    .pipe($.vinylSourceStream('bundle.min.js'))
    .pipe($.vinylBuffer())
    .pipe($.uglify())
    .pipe(gulp.dest(config.buildRoot + 'js/'));
});

/**
 * Task-Watch: JavaScript
 */
gulp.task('js-watch', ['js'], browserSyncReload);

/**
 * Task-Watch: Handlebars
 */
gulp.task('handlebars-watch', ['js'], browserSyncReload);

/**
 * Task: Styles.vendor
 */
gulp.task('styles:vendor', () => {
  return gulp.src(config.vendorCSS)
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe($.concat('vendor.min.css'))
    .pipe($.postcss([
      $.cssnano({safe: true}),
    ]))
    .pipe(gulp.dest(config.buildRoot + 'css/'));
});

/**
 * Task: Styles.custom
 */
gulp.task('styles:custom', () => {
  return gulp.src(config.srcRoot + 'styles/bundle.styl')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe($.stylus())
    .pipe($.concat('bundle.min.css'))
    .pipe($.postcss([
      $.autoprefixer({browsers: ['last 2 versions']}),
      $.cssnano({safe: true}),
    ]))
    .pipe(gulp.dest(config.buildRoot + 'css/'))
    .pipe(browserSyncInstance.stream());
});

/**
 * Task: Stylelint
 */
gulp.task('stylelint', () => {
  return gulp.src(config.srcRoot + 'styles/partials/*.styl')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe($.stylus())
    .pipe($.postcss([
      $.stylelint(),
      $.postcssReporter({clearMessages: true}),
    ]));
});

/**
 * Task: Jade
 */
gulp.task('jade', () => {
  return gulp.src('./src/**.jade')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe($.jade())
    .pipe(gulp.dest(config.buildRoot));
});

/**
 * Task-Watch: Jade
 */
gulp.task('jade-watch', ['jade'], browserSyncReload);

/**
 * Task: SVG
 */
gulp.task('svgo', () => {
  return gulp.src('./src/svg/_origin/**/*')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe($.svgmin())
    .pipe(gulp.dest(config.srcRoot + 'svg/'));
});

/**
 * Task-Watch: SVG
 */
gulp.task('svgo-watch', (callback) => {
  $.runSequence('svgo', 'jade-watch', callback);
});

/**
 * Task: Images
 */
gulp.task('imageOptim', () => {
  return gulp.src(config.srcRoot + 'images/**/*')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe($.imagemin({
      progressive: true,
    }))
    .pipe(gulp.dest(config.buildRoot + 'images/'));
});

/**
 * Task: Photos
 */
gulp.task('photos', () => {
  return gulp.src(config.srcRoot + 'photo/**/*')
    .pipe($.plumber({
      errorHandler: plumberErrorHandler,
    }))
    .pipe(gulp.dest(config.buildRoot + 'photo/'));
});

/**
 * Task: Watch
 */
gulp.task('watch', ['browserSync'], () => {
  gulp.watch(config.srcRoot + 'data/**/[^!]*.json', ['json-watch']);
  gulp.watch(config.srcRoot + '**/[^!]*.jade', ['jade-watch']);
  gulp.watch(config.srcRoot + 'svg/_origin/[^!]*.svg', ['svgo-watch']);
  gulp.watch(config.srcRoot + 'js/**/[^!]*.js', ['js-watch']);
  gulp.watch(config.srcRoot + 'templates/**/[^!]*.hbs', ['handlebars-watch']);
  gulp.watch(config.srcRoot + 'styles/**/[^!]*.styl', ['styles:custom']);
});

/**
 * Task: Clean
 */
gulp.task('clean', (cb) => {
  $.del.sync(config.buildRoot + '*');
  cb();
});

/**
 * Task: Build
 */
gulp.task('build', (cb) => {
  $.runSequence('clean', [
    'jade',
    'imageOptim',
    // 'styles:vendor',
    'styles:custom',
    'js',
    'json',
    'html',
  ], cb);
});

/**
 * Task: Deploy
 *
 * example of ftp_config.json
 *  {
 *    "host": "example.com",
 *    "user": "user",
 *    "pass": "password",
 *    "remotePath": "/.../"
 *  }
 */
gulp.task('deploy', () => {
  const ftpConfig = require('./ftp_config.json');

  const ftpConnection = $.vinylFtp.create({
    host: ftpConfig.host,
    user: ftpConfig.user,
    password: ftpConfig.pass,
  });

  $.notify({
    title: 'Hamper deploy',
    message: 'Deployed'
  });

  gulp.src(config.buildRoot + '/**/*', {buffer: false})
      .pipe(ftpConnection.dest(ftpConfig.remotePath))
      .pipe($.notify({
        title: 'Hamper deploy',
        message: 'Deployed',
        onLast: true,
      }));
});

/**
 * Task: Serve
 */
gulp.task('serve', ['watch']);
