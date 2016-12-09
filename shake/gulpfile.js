const gulp = require('gulp');
const postcss = require('postcss');
const _postcss = require('gulp-postcss');
const _import = require('postcss-import');
const rename = require('gulp-rename');
const autoprefixer = require('autoprefixer');
const csswring = require('csswring'); //会去掉注释，fuck
const cssmqpacker = require('css-mqpacker');
const px2rem = require('postcss-px2rem');
const nested = require('postcss-nested');
const babel = require('gulp-babel');

gulp.task('postcss', () => {
  let processors = [
    _import,
    nested,
    cssmqpacker,
    px2rem({ remUnit: 75 }),
    autoprefixer
  ];
  return gulp.src('./mobile/css/main.css')
    .pipe(_postcss(processors))
    .on('error', errorHandler)
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./mobile/css/'))
});



gulp.task('pcPostcss', () => {
  let processors = [
    nested,
    cssmqpacker,
    autoprefixer
  ];
  return gulp.src('./pc/css/main.css')
    .pipe(_postcss(processors))
    .on('error', errorHandler)
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./pc/css/'))
})

gulp.task('mbtoes5', () => {
  return gulp.src('./mobile/js/src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./mobile/js/dest'))
});
gulp.task('pctoes5', () => {
  return gulp.src('./pc/js/src/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./pc/js/dest'))
});

gulp.task('watch', () => {
  gulp.watch('./mobile/css/src/**/*.css', ['postcss']);
  gulp.watch('./mobile/js/src/**/*.js', ['mbtoes5']);
  gulp.watch('./pc/css/src/**/*.css', ['pcPostcss']);
  gulp.watch('.pc/js/src/**/*.js', ['pctoes5']);
})

gulp.task('default', ['postcss', 'pcPostcss', 'mbtoes5', 'pctoes5', 'watch']);

function errorHandler(error) {
  console.log(error.message);
  console.log(error.fileName);
  console.log('line:', error.line, 'column:', error.column);
  this.emit('end');
}