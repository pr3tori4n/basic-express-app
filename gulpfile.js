const gulp = require('gulp');
const path = require('path'); //https://nodejs.org/api/path.html
const del = require('del'); //Cleans out a directory of all folders and files
//CSS Tooling
const sass = require('gulp-sass'); //gulp wrapper for node-sass to use with gulp streams
sass.compiler = require('node-sass'); //Explicitly define the compiler used by gulp-sass instead of relying on default
const plumber = require('gulp-plumber'); //Prevents crashes from watch if sass compiles fail or other node stream errors
const postcss = require("gulp-postcss"); //Wrapper for autoprefixer and cleancss (postcss-clean)
const autoprefixer = require("autoprefixer"); //Automatically adds vendor prefixes to appropriate css property names
const cleancss = require('postcss-clean'); //Minifies CSS
const rename = require("gulp-rename"); //for renaming a file in the stream
//JS Tooling
const replace = require('gulp-replace-path'); //for modifying paths in js files so imports work after moving the files using gulp.dest with different folder structure.

/* TODO: replace all paths with path.join for Cross-OS compatibility
** https://nodejs.org/api/path.html#path_path_join_paths
*/
const paths = {
    css: {
        src: path.join(__dirname, "src/client/**/*.scss"),
        dest: path.join(__dirname, "build")
    }
};

const clean = function() {
    return del(['./build/**', '!./build', '!./build/.gitkeep', './src/server/views/components/**']);
};

//Copy pug files from components directory to express views directory
const copyViews = function() {
    return gulp.src('./src/components/**/*.pug')
        .pipe(gulp.dest('./src/server/views/components'));
};

//Copy images to the build directory
const copyImages = function() {
    return gulp.src('./src/client/images/**/*[.jpg|.png|.gif]')
        .pipe(gulp.dest('./build/images'));
};

const watchFiles = function() {
    //watch for changes in *.pug files under ./components, and copy them over automatically
    gulp.watch('./src/components/**/*.pug', { ignoreInitial: false }, copyViews);
    gulp.watch(['./src/client/**/*.js', './src/components/**/*.js'], { ignoreInitial: false }, js);
    gulp.watch('./src/client/**/*.scss', css);
};

// CSS task
const css = function() {
    return gulp.src("./src/client/**/*.scss", { sourcemaps: true })
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest("./build/"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([autoprefixer(), cleancss()]))
        .pipe(gulp.dest("./build/", { sourcemaps: true }))
};
// JS Tasks
const js_application = function(done) {    
    return gulp.src("./src/client/**/*.js", { sourcemaps: true })
        .pipe(replace(/\.\.\/components/, './components')) //Replace components import directory because js_components() makes it a sibling directory
        .pipe(gulp.dest("./build/", { sourcemaps: true }));
};
const js_components = function(done) {
    return gulp.src("./src/components/**/*.js", { sourcemaps: true })
        .pipe(gulp.dest("./build/js/components", { sourcemaps: true }));
};
const js = gulp.parallel(js_application, js_components);

module.exports.clean = clean;
module.exports.copyViews = copyViews;
module.exports.copyImages = copyImages;
module.exports.css = css;
module.exports.js = js;
module.exports.default = gulp.series(clean, gulp.parallel(copyViews, copyImages, css, js));
module.exports.watch = watchFiles;