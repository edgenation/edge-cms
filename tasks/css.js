var path = require("path");
var gulp = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");
var cssAutoprefixer = require("autoprefixer");
var config = require("./config");

var plugins = gulpLoadPlugins();
var postCss = gulpLoadPlugins({
    pattern: ["postcss-*", "postcss.*"],
    replaceString: /^postcss(-|\.)/
});


gulp.task("css", function() {
    var cssProcessors = [
        postCss.normalize(),
        postCss.partialImport({
            extension: "scss"
        }),
        postCss.nested(),
        postCss.discardComments(),
        postCss.simpleVars(),
        cssAutoprefixer({ browsers: config.browsers })
    ];

    return gulp
        .src([
            path.join(config.dir.src, config.dir.client, config.dir.scss, config.glob.scss),
            "!" + config.glob.scssPartial
        ])
        .pipe(plugins.plumber())
        .pipe(plugins.postcss(cssProcessors, { syntax: postCss.scss }))
        .pipe(plugins.csscomb())
        .pipe(plugins.combineMq({ beautify: false }))
        .pipe(plugins.minifyCss({ keepSpecialComments: 0 }))
        .pipe(plugins.csso())
        .pipe(plugins.cssbeautify({ autosemicolon: true }))
        .pipe(plugins.rename({
            extname: ".css"
        }))
        .pipe(gulp.dest(path.join(config.dir.dist, config.dir.css)));
});
