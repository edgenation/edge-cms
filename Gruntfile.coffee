module.exports = (grunt) ->
    require("load-grunt-tasks")(grunt)

    minifyify = require "minifyify"
    
    grunt.initConfig
        pkg: grunt.file.readJSON "package.json"
        
        bump:
            options:
                files: ["package.json"]
                updateConfigs: ["pkg"]
                commit: true
                commitMessage: "chore(release): v%VERSION%"
                commitFiles: ["package.json"]
                createTag: true
                tagName: "v%VERSION%"
                tagMessage: "Version %VERSION%"
                push: true
                pushTo: "origin master"
                gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d"

        changelog:
            options:
                dest: "CHANGELOG.md"

        # Lint the coffeescript
        coffeelint:
            options:
                configFile: "coffeelint.json"
            config:
                files:
                    src: ["Gruntfile.coffee"]
            tests:
                files:
                    src: ["test/**/*.coffee"]
            backend:
                files:
                    src: ["src/**/*.coffee"]


        # Backend tests
        mochaTest:
            test:
                options:
                    reporter: "spec"
                    require: [
                        "coffee-script/register"
                        "test/coverage/blanket"
                        "test/specHelper.coffee"
                    ]
                src: ["test/tdd/**/*.coffee"]
            coverageReport:
                options:
                    reporter: "html-cov"
                    quiet: true
                    captureFile: "test/coverage/backend.html"
                src: ["test/tdd/**/*.coffee"]
            coverageThreshold:
                options:
                    reporter: "travis-cov"
                src: ["test/tdd/**/*.coffee"]


        coffee:
            dist:
                expand: true
                flatten: false
                cwd: "src"
                src: ["**/*.coffee"]
                dest: "lib"
                ext: ".js"

        # Should be used for frontend code
        browserify:
            dist:
                options:
                    transform: ["coffeeify"]
                    browserifyOptions:
                        extensions: [".coffee"]
                        debug: true
                    preBundleCB: (b) ->
                        b.plugin minifyify,
                            output: "dist/edge-cms.min.map.json"
                            map: "edge-cms.min.map.json"
                            compressPath: ""
                files:
                    "dist/edge-cms.min.js": ["src/index.coffee"]


        watch:
            backend:
                files: ["src/**/*.coffee", "test/tdd/**/*.coffee"]
                tasks: ["test", "build"]


    grunt.registerTask "test", ["newer:coffeelint", "mochaTest"]
    grunt.registerTask "build", ["newer:coffee"]
    grunt.registerTask "default", ["test", "build"]