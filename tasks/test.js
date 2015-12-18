"use strict";

var gulp = require("gulp");
var path = require("path");
var plugins = require("gulp-load-plugins")();
var config = require("./config");

gulp.task("unit-test-api", function (cb) {
    gulp.src(path.join(config.dir.api, config.glob.js))
        .pipe(plugins.plumber())
        .pipe(plugins.istanbul({
            includeUntested: true
        }))
        .pipe(plugins.istanbul.hookRequire())
        .on("finish", function () {
            return gulp .src(path.join(config.dir.apiUnitTest, config.glob.js), { read: false })
                .pipe(plugins.plumber())
                .pipe(plugins.mocha({ reporter: "spec" }))
                .pipe(plugins.istanbul.writeReports({
                    dir: config.dir.coverage,
                    reportOpts: { dir: config.dir.coverage },
                    reporters: ["text-summary", "json", "html"]
                }))
                .pipe(plugins.plumber.stop())
                .on("end", cb);
        })
        .pipe(plugins.plumber.stop());

});
