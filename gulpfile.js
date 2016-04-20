// npm i --save-dev gulp gulp-jshint gulp-concat gulp-rename gulp-uglify

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var gfConfig = require('./gulpfile-config');

// Линтинг файлов
gulp.task('lint', function() {
  gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Конкатенация и минификация файлов
gulp.task('vendor', function(){
    gulp.src(gfConfig.vendorJs)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./js'))
        .pipe(rename('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist'));
});

// Действия по умолчанию
gulp.task('default', function(){
  gulp.run('vendor');

  // Отслеживаем изменения в файлах
  // gulp.watch("./gulpfile-config.json", function(event){
  //   gulp.run('vendor');
  // });
});
