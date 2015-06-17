var path = require("path");
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var browserify = require("browserify");
var aliasify = require("aliasify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var bundleCollapser = require("bundle-collapser/plugin");
var config = require("./config");


gulp.task("vendor", function () {
    var b = browserify({
        debug: false,
        plugin: [bundleCollapser]
    });

    config.libs.forEach(function (lib) {
        b.require(lib);
    });

    b.transform({ global: true }, aliasify);

    return b.bundle()
        .pipe(plugins.plumber())
        .pipe(source(config.file.vendor))
        .pipe(buffer())
        .pipe(plugins.uglify())
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.js)));
});
