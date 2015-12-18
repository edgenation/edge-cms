"use strict";

module.exports = {
    glob: {
        html: "**/*.html",
        jade: "**/*.jade",
        css: "**/*.css",
        scss: "**/*.scss",
        scssPartial: "**/_*.scss",
        js: "**/*.js",
        json: "**/*.json"
    },
    dir: {
        dist: "public",
        src: "src",
        client: "client",
        js: "js",
        scss: "scss",
        css: "css",

        api: "src/api",
        apiUnitTest: "test/unit/api",
        coverage: "coverage",
        tasks: "tasks"
    },
    file: {
        entry: "admin.js",
        vendor: "cms-vendor.js",
        gulpfile: "./gulpfile.js"
    },

    browsers: ["last 2 versions"]
};
