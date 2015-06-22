var path = require("path");
var gulp = require("gulp");
var config = require("./config");

gulp.task("watch", ["build"], function() {
    gulp.watch([
        path.join(config.dir.src, config.dir.client, config.glob.js),
        path.join(config.dir.src, config.dir.client, config.glob.jade)
    ], ["js"]);
});
