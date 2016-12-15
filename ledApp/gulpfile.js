const gulp = require('gulp');
const babel = require('gulp-babel');

const postcss = require('postcss');
const _postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const _import = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssmqpacker = require('css-mqpacker');
const px2rem = require('postcss-px2rem');
const nested = require('postcss-nested');

const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('server', function() {
  browserSync.init({
    server: {
        baseDir: "./"
    }
  });
  gulp.watch("./*.html").on('change', reload);
});

gulp.task('postcss', ()=>{
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
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./css/'))
    .pipe(reload({stream: true}))
})

gulp.task('toes5', () => {
  return gulp.src('./js/src/**/*.js')
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(gulp.dest('./js/dest/'))
        .pipe(reload({stream: true}));
})

gulp.task('watch', () => {
  gulp.watch('./css/src/**/*.css', ['postcss']);
  gulp.watch('./js/src/**/*.js', ['toes5']);
  gulp.watch('./*.html').on('change', reload)
})

gulp.task('default', ['server','watch']);

function errorHandler(error){
  console.log(error.message);
  console.log(error.fileName);
  console.log('line:', error.line, 'column:', error.column);
  this.emit('end');
}
