const gulp = require('gulp');
const del = require('del');

const clean = function() {
    return del(['./build/**', '!./build', '!./build/.gitkeep']);
};

//Copy pug files from components directory to express views directory
const copyPugViewFiles_fromComponents_toExpressViewsFolder = function() {
    return gulp.src('./src/components/**/*.pug')
        .pipe(gulp.dest('./src/server/views/components'));
};

const watchFiles = function() {
    //watch for changes in *.pug files under ./components, and copy them over automatically
    gulp.watch('./src/components/**/*.pug', { ignoreInitial: false }, copyPugViewFiles_fromComponents_toExpressViewsFolder);
};

const log = function(done) {
    console.log('I gulped!');
    done();
};

module.exports.clean = clean;
module.exports.watch = watchFiles;
module.exports.copyViews = copyPugViewFiles_fromComponents_toExpressViewsFolder;
module.exports.default = gulp.series(clean, log);