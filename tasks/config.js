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
        scss: "scss",
        css: "css",

        api: "src/api",
        apiUnitTest: "test/unit/api",
        coverage: "coverage",
        tasks: "tasks"
    },
    file: {
        entries: [
            "cms-backbone.js",
            "cms-angular.js"
        ],
        vendor: "cms-vendor.js",
        gulpfile: "./gulpfile.js",
        normalize: "node_modules/normalize.css/normalize.css"
    },

    browsers: ["last 2 versions"],

    libs: [
        "jquery",
        "lodash",

        "backbone",
        "backbone.marionette",
        "backbone.wreqr",
        "backbone-routing",

        "angular",
        "angular-ui-router",
        "angular-resource"
    ]
};
