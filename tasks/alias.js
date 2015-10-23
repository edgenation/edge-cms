var gulp = require("gulp");

gulp.task("build", ["vendor", "js"]);

gulp.task("test", ["unit-test-api"]);

gulp.task("default", ["build"]);
