module.exports = (grunt) ->
    require("load-grunt-tasks")(grunt)
    
    grunt.initConfig
        pkg: grunt.file.readJSON "package.json"
        
        
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


        watch:
            backend:
                files: ["src/**/*.coffee", "test/tdd/**/*.coffee"]
                tasks: ["test"]
            
    grunt.registerTask "test", ["newer:coffeelint", "mochaTest"]
    grunt.registerTask "default", ["test"]