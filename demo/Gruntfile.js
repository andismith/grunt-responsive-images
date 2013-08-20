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
    copy: {
      dev: {
        files: [{
          expand: true,
          src: ['**/*', '!assets/img/**/*.*'],
          cwd: 'src/',
          dest: 'dist/'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-responsive-images');

  grunt.registerTask('default', ['copy','responsive_images']);
};