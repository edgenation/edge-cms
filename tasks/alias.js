var gulp = require("gulp");

gulp.task("build", ["vendor", "css", "js"]);

gulp.task("test", ["unit-test-api"]);

gulp.task("default", ["build"]);
