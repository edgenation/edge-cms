var path = require("path");
var gulp = require("gulp");
var plugins = require("gulp-load-plugins")();
var streamQueue = require("streamqueue");
var config = require("./config");


var onError = function(err) {
    plugins.util.log(err);
    this.emit("end");
};


gulp.task("css", function() {
    var stream = streamQueue({ objectMode: true });
    stream.queue(gulp.src(config.file.normalize));
    stream.queue(
        gulp
            .src(path.join(config.dir.src, config.dir.client, config.dir.scss, config.glob.scss))
            .pipe(plugins.plumber({
                errorHandler: onError
            }))
            .pipe(plugins.sass())
            .pipe(plugins.plumber.stop())
    );

    return stream.done()
        .pipe(plugins.plumber({
            errorHandler: onError
        }))
        .pipe(plugins.concat("admin.css"))
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.css)));
        //.pipe(browserSync.reload({ stream: true }));
});
