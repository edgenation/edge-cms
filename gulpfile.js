var gulp = require("gulp"),
    plumber = require("gulp-plumber");

var browserify = require("browserify"),
    es6ify = require("es6ify"),
    source = require("vinyl-source-stream"),
    streamify = require("gulp-streamify");


var
    //es6Path = "./client/v1/bootstrap.js",
    es6Path = "./client/v2/cms.js",
    compilePath = "./public/js";


gulp.task("js", function () {
    return browserify(es6ify.runtime)
        .transform(es6ify)
        .add(es6Path)
        .bundle()
        .pipe(source("cms.js"))
        //.pipe(streamify(uglify()))
        .pipe(gulp.dest(compilePath));
});

gulp.task("default", ["js"]);
