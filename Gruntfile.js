'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            'dist'
                        ]
                    }
                ]
            }
        },
        responsive_images: {
            dev: {
                options: {},
                files: [
                    {
                        expand: true,
                        src: ['assets/img/**/*.{jpg,gif,png}'],
                        cwd: 'src/',
                        dest: 'dist/'
                    }
                ]
            }
        },
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        src: ['**/*', '!assets/img/**/*.*'],
                        cwd: 'src/',
                        dest: 'dist/'
                    }
                ]
            }
        },
        'gh-pages': {
            options: {
                base: './',//specify the current dir
                branch: 'master',
                repo: 'https://github.com/qcgm1978/grunt-responsive-images.git',
                user: {
                    name: 'ZhangHong-liang',
                    email: 'Zhanghongliang@raxtone.com '
                }
            },
            src: ['**/*', '!node_modules/**/*']
        }
    });
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-responsive-images');

    grunt.registerTask('default', ['clean', 'copy', 'responsive_images']);
};