'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {},
        files: [{
          expand: true,
          src: ['assets/img/**/*.{jpg,gif,png}'],
          cwd: 'src/',
          dest: 'dist/'
        }]
      }
    },
    connect: {
      dev: {
        options: {
          port: 3000,
          base: './dist/'
        }
      }
    },
    copy: {
      dev: {
        files: [{
          expand: true,
          src: ['**/*', '!assets/img/**/*.*'],
          cwd: 'src/',
          dest: 'dist/'
        }]
      }
    },
    watch: {
      options: {
        livereload: true
      },
      all_files: {
        expand: true,
        files: ['**/*', '!assets/img/**/*.*'],
        tasks: 'copy'
      },
      images: {
        expand: true,
        files: 'assets/img/**/*.{jpg,gif,png}',
        tasks: 'responsive_images'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-responsive-images');

  grunt.registerTask('default', ['copy','responsive_images', 'connect', 'watch']);
};