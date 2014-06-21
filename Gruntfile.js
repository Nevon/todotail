'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        appFolder: './app/static/',
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        copy: {
            dist: {
                files: [
                    {
                        src: '<%= appFolder %>src/index.html',
                        dest: '<%= appFolder %>dist/index.html'
                    }
                ]
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= appFolder %>dist'
            },
            html: '<%= appFolder %>src/index.html'
        },
        usemin: {
            html: ['<%= appFolder %>dist/index.html']
        },
        less: {
            options: {
                paths: ['<%= appFolder %>src/less']
            },
            dist: {
                src: ['<%= appFolder %>src/**/*.less'],
                dest: '<%= appFolder %>dist/css/main.css'
            }
        },
        ngmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= appFolder %>src/js',
                    src: '**/*.js',
                    dest: '<%= appFolder %>src/js'
                }]
            }
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: true
                },
                files: {
                    '<%= appFolder%>dist/js/main.min.js': ['<%= appFolder %>src/js/**/*.js']
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            less: {
                files: '<%= appFolder %>src/**/*.less',
                tasks: ['less']
            },
            jslib: {
                files: '<%= appFolder %>lib/**/*.js',
                tasks: ['build:jslib']
            },
            js: {
                files: '<%= appFolder %>src/js/**/*.js',
                tasks: 'build:js'
            }
        },
        clean: ['<%= appFolder %>dist/']
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt);

    // Default task.
    grunt.registerTask('build:js', ['ngmin', 'uglify']);
    grunt.registerTask('build:jslib', ['useminPrepare', 'copy', 'concat', 'usemin']);
    grunt.registerTask('build:all', ['clean', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', 'less', 'usemin']);
    grunt.registerTask('default', ['build:all', 'watch']);

};