/*
 * grunt-responsive-images
 * https://github.com/andrew.smith/grunt-responsive-images
 *
 * Copyright (c) 2013 andismith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    responsive_images: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options/minions.jpg': 'test/assets/default_options/minions.jpg'
        }
      },
      file_wildcard_options: {
        options: {
        },
        files: [{
          expand: true,
          src: ['file_wildcard_options/**.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      custom_options: {
        options: {
          sizes: [{
            width: 110,
            name: "small"
          },{
            width: 220
          },{
            width: 330,
            name: "large"
          },{
            width: 660,
            name: "large",
            suffix: "_x2" // retina gfx
          }]
        },
        files: [{
          expand: true,
          src: ['custom_options/**.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'responsive_images', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
