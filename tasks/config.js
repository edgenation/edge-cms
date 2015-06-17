module.exports = {
    glob: {
        html: "**/*.html",
        jade: "**/*.jade",
        css: "**/*.css",
        scss: "**/*.scss",
        js: "**/*.js",
        json: "**/*.json"
    },
    dir: {
        dist: "public",
        src: "src",
        client: "client",
        js: "js",

        api: "src/api",
        apiUnitTest: "test/unit/api",
        coverage: "coverage",
        tasks: "tasks"
    },
    file: {
        entryjs: "cms.js",
        vendor: "cms-vendor.js",
        gulpfile: "./gulpfile.js"
    },

    libs: [
        "jquery",
        "lodash",
        "backbone",
        "backbone.marionette"
    ]
};
