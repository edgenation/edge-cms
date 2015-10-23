var path = require("path");
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var browserify = require("browserify");
var jadeify = require("jadeify");
var globify = require("require-globify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var bundleCollapser = require("bundle-collapser/plugin");
var config = require("./config");


gulp.task("js", function () {
    config.file.entries.forEach(function (entry) {
        var b = browserify({
            entries: path.join(config.dir.src, config.dir.client, config.dir.js, entry),
            debug: true,
            transform: [jadeify, globify],
            plugin: [bundleCollapser],
            bundleExternal: false   // Don't load external requires
        });

        // Add the jade runtime
        b.require("jade/runtime");

        b.bundle()
            .on("error", function(err) {
                console.error(err.message);
                this.emit("end");
            })
            .pipe(plugins.plumber())
            .pipe(source(entry))
            .pipe(buffer())
            .pipe(plugins.sourcemaps.init({ loadMaps: true }))
            .pipe(plugins.uglify())
            .pipe(plugins.sourcemaps.write("./"))
            .pipe(gulp.dest(path.join(config.dir.dist, config.dir.js)));
    });
});
