var gulp = require("gulp");

gulp.task("build", ["vendor", "js"]);

gulp.task("default", ["build"]);
