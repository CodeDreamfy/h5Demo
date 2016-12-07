var gulp = require('gulp');
var postcss = require('postcss');
var _postcss = require('gulp-postcss');
var _import = require('postcss-import');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring'); //会去掉注释，fuck
var cssmqpacker = require('css-mqpacker');
var concat = require('gulp-concat');
var px2rem = require('postcss-px2rem');
var nested = require('postcss-nested');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');//js检测

gulp.task('postcss', function(){
  var processors = [
    _import,
    nested,
    cssmqpacker,
    px2rem({remUnit: 75}),
    autoprefixer
  ];
  return gulp.src('./css/main.css')
    .pipe(_postcss(processors))
    .on('error', errorHandler)
    .pipe(concat('main.css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./css/'))
});

gulp.task('toes5', function(){
  return gulp.src('./js/src/**/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(gulp.dest('./js/dest'))
});
gulp.task('lint', function(){
  return gulp.src('./js/dest/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', {beep: true}))
})

gulp.task('watch', function(){
  gulp.watch('./css/src/**/*.css', ['postcss']);
  gulp.watch('./js/src/**/*.js', ['toes5']);
  //gulp.watch('./js/dest/**/*.js', ['lint']);
})

gulp.task('default', ['postcss', 'toes5', 'watch']);

function errorHandler(error){
  console.log(error.message);
  console.log(error.fileName);
  console.log('line:', error.line, 'column:', error.column);
  this.emit('end');
}
