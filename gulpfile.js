var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    gutil       = require('gulp-util'),
    plumber     = require('gulp-plumber'),
    slang       = require('gulp-slang'),
    rename      = require('gulp-rename'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    jshint      = require('gulp-jshint');

/* AEM Instance Configurations */
var config = {
  host: 'localhost',
  port: 4502,
  username: 'admin',
  password: 'admin'
}

/* Paths */
var mainPath        = 'aem-codebase/ui.apps/src/main/content/jcr_root/';
    // HTML or JSP templates
    componentsPath  = mainPath + 'apps/aem-codebase/components/',
    // Styles
    cssPath         = mainPath + 'etc/clientlibs/aem-codebase/css/',
    sassPath        = mainPath + 'etc/clientlibs/aem-codebase/sass/',
    // Scripts
    jsPath          = mainPath + 'etc/clientlibs/aem-codebase/js/',
    // Images
    imgPath         = mainPath + 'etc/clientlibs/aem-codebase/images/';



/**
 * Helper: changeNotification
 * Logs an event to the console.
 *
 * @param {String} fType - The file type that was changed.
 * @param {String} eType - The event that occured.
 * @param {String} msg - Short description of the actions that are being taken.
 */

function changeNotification(fType, eType, msg) {
  gutil.log(gutil.colors.cyan.bold(fType), 'was', gutil.colors.yellow.bold(eType) + '.', msg);
}

/**
 * Task: `sass:build`
 * Compiles the sass and writes sourcemaps.
 */
gulp.task('sass:build', function (cb) {
      var a = gulp.src([
          sassPath + '**/*.scss',
        ])
        .pipe(plumber()) // Prevents pipe breaking due to error (for watch task)
        .pipe(sourcemaps.init())
        .pipe(sass({
            // outputStyle: 'compressed',
            omitSourceMapUrl: true,
            includePaths: [sassPath, componentsPath]
        }).on('error', sass.logError))
        .pipe(sourcemaps.write('./', {
            addComment: false
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest(cssPath))
        // Fire the callback Gulp passes in to tell it we're done
        .on('end', cb);
});

/**
 * Task: `sass:sling`
 * Slings the compiled stylesheet and sourcemaps to AEM.
 */
gulp.task('sass:sling', ['sass:build'], function () {
  return gulp.src([
      cssPath + '**/*.css',
      cssPath + '**/*.map',
    ])
    .pipe(slang(config));
});

/**
 * Task: `sass`
 * Runs the sass build and slings the results to AEM.
 */
gulp.task('sass', ['sass:build', 'sass:sling']);

/**
 * Task: `js:lint`
 * Lints project JS, excluding vendor libs.
 */
gulp.task('js:lint', function () {
  return gulp.src([
      componentsPath + '**/*.js',
      jsPath + '**/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});


/**
 * Task: `watch`
 * Watches the HTML, Sass, and JS for changes. On a file change,
 * will run builds file-type dependently and sling the new files
 * up to AEM.
 */
gulp.task('watch', function () {
  gutil.log('Waiting for changes.');

  // Set up our streams
  var jsWatch = gulp.watch([
        componentsPath + '**/*.js',
        jsPath + '**/*.js'
      ], ['js:lint']),

      sassWatch = gulp.watch([
          componentsPath + '**/*.scss',
          sassPath + '**/*.scss'
      ], ['sass']),

      cssWatch = gulp.watch([
        cssPath + '**/*.css',
        cssPath + '**/*.css'
      ]),

      markupWatch = gulp.watch([
        componentsPath + '**/**/*.html',
        componentsPath + '**/**/*.jsp'
      ]),

      imgWatch = gulp.watch([
        imgPath + '**/*'
      ]);


  // js needs to be linted
  jsWatch.on('change', function (ev) {
    changeNotification('JS file', ev.type, 'Linting code & slinging to AEM.');

    return gulp.src(ev.path)
      .pipe(slang(config));
  });

  // Sass needs to get built and slung up
  sassWatch.on('change', function (ev) {
    changeNotification('Sass file', ev.type, 'Running compilation & slinging to AEM.');

    return gulp.src(ev.path)
      .pipe(slang(config));
  });

  // CSS just needs to be slung to AEM
  cssWatch.on('change', function (ev) {
    changeNotification('CSS file', ev.path, 'Slinging file to AEM.');

    return gulp.src(ev.path)
      .pipe(slang(config));
  });

  // Markup just needs to be slung to AEM
  markupWatch.on('change', function (ev) {
    changeNotification('Sightly file', ev.path, 'Slinging file to AEM.');

    return gulp.src(ev.path)
      .pipe(slang(config));
  });

  // Images just need to be slung to AEM
  imgWatch.on('change', function (ev) {
    changeNotification('Image file', ev.type, 'Slinging file to AEM.');

    return gulp.src(ev.path)
      .pipe(slang(config));
  });
});
