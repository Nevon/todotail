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
                paths: ['<%= appFolder %>src/less'],
                strictImports: true,
                sourceMap: true
            },
            dist: {
                src: ['<%= appFolder %>src/less/main.less'],
                dest: '<%= appFolder %>dist/css/main.css'
            }
        },
        autoprefixer: {
            options: {
                map: true
            },
            dist: {
                expand: true,
                flatten: true,
                src: '<%= appFolder %>dist/css/*.css',
                dest: '<%= appFolder %>dist/css/'
            }
        },
        svgsprite: {
            options: {
                render: {
                    css: false,
                    less: {
                        dest: 'sprite'
                    }
                },
                spritedir: ['../../dist/img']
            },
            dist: {
                src: '<%= appFolder %>src/img/icons/',
                dest: '<%= appFolder %>src/less/'
            }
        },
        'string-replace': {
            sprite: {
                files: {
                    '<%= appFolder %>src/less/sprite.less': '<%= appFolder %>src/less/sprite.less' //Hack to fix sprite path after compilation
                },
                options: {
                    replacements: [{
                        pattern: '../../dist/img/',
                        replacement: '../img/'
                    }]
                }
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
            },
            html: {
                files: '<%= appFolder %>src/index.html',
                tasks: 'build:html'
            },
            svg: {
                files: '<%= appFolder%>src/img/icons/*.svg',
                tasks: 'build:svg'
            }
        },
        clean: ['<%= appFolder %>dist/']
    });

    // These plugins provide necessary tasks.
    require('load-grunt-tasks')(grunt);

    // Default task.
    grunt.registerTask('build:html', ['useminPrepare', 'copy', 'usemin']);
    grunt.registerTask('build:js', ['ngmin', 'uglify']);
    grunt.registerTask('build:jslib', ['useminPrepare', 'copy', 'concat', 'usemin']);
    grunt.registerTask('build:svg', ['svgsprite', 'string-replace:sprite']);
    grunt.registerTask('build:css', ['less', 'autoprefixer']);
    grunt.registerTask('build:all', ['clean', 'useminPrepare', 'copy', 'concat', 'ngmin', 'uglify', 'build:css', 'build:svg', 'usemin']);
    grunt.registerTask('default', ['build:all', 'watch']);

};