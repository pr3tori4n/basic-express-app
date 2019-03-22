const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => del(['./build/**', '!./build', '!./build/.gitkeep']));

gulp.task('default', function(done) {
    console.log('I gulped!');
    done();
});