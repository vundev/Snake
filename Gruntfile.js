/**
 * Created by Nasko on 4.7.2016 г..
 */
module.exports = function (grunt) {
    'use strict';

    var VERSION = '0.0.0'

    grunt.initConfig({
        typescript: {
            debug: {
                dest: 'bin/snake.debug.js',
                src: ['src/Main.ts'],
                options: {
                    target: 'ES5',
                    comments: true,
                    sourceMap: true,
                    declaration: false,
                    references: [
                        'libs/jquery.d.ts',
                        'libs/puremvc.d.ts',
                        'libs/pixi.js.d.ts'
                    ]
                }
            }
        },
        uglify: {
            debug: {
                options: {
                    sourceMap: true,
                    sourceMapIn: 'bin/snake.debug.js.map',
                    mangle: false,
                    compress: {
                        global_defs: {
                            "DEBUG": true,
                            "VERSION": VERSION
                        }
                    }
                },
                files: {
                    'bin/snake.debug.min.js': ['bin/snake.debug.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.registerTask('debug', ['typescript:debug', 'uglify:debug']);
};