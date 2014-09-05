module.exports = (grunt) ->
    require("load-grunt-tasks")(grunt)
    
    grunt.initConfig
        pkg: grunt.file.readJSON "package.json"
        
        coffeelint:
            options:
                configFile: "coffeelint.json"
            config:
                files:
                    src: ["Gruntfile.coffee"]


    grunt.registerTask "test", ["newer:coffeelint"]
    grunt.registerTask "default", ["test"]