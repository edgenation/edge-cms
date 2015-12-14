var gulp = require("gulp");

gulp.task("build", ["css", "js"]);

gulp.task("test", ["unit-test-api"]);

gulp.task("default", ["build"]);
