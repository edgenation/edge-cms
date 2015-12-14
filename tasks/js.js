var path = require("path");
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var browserify = require("browserify");
var bundleCollapser = require("bundle-collapser/plugin");
var through2 = require("through2");
var config = require("./config");


gulp.task("js", function () {
    var bundler = through2.obj(function (file, enc, next) {
        browserify(file.path, {
            debug: true,
            plugin: [bundleCollapser],
            bundleExternal: false
        })
        .bundle(function (err, res) {
            if (err) {
                return next(err);
            }
            file.contents = res;
            next(null, file);
        });
    });


    return gulp
        .src(path.join(config.dir.src, config.dir.client, config.dir.js, config.file.entry))
        .pipe(plugins.plumber())
        .pipe(bundler)
        .pipe(plugins.sourcemaps.init({ loadMaps: true }))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write("./"))
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.js)));
});
