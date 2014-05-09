/*
 * grunt-responsive-images
 * https://github.com/andismith/grunt-responsive-images
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
      options: {
        engine: 'im'
      },
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options/minions.jpg': 'test/assets/default_options/minions.jpg'
        }
      },
      no_files: {
        options: {
          sizes: [{
            width: 320
          }]
        },
        files: [{
          expand: true,
          src: ['no_files/**/*.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      file_wildcard_options: {
        options: {
          sizes: [{
            aspectRatio: false,
            height: 240,
            name: 'small',
            width: 320
          },{
            aspectRatio: false,
            height: 480,
            name: 'medium',
            width: 640
          },{
            aspectRatio: false,
            height: 768,
            name: 'large',
            width: 1024
          }]
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
            name: "small",
            quality: 40
          },{
            width: 220,
            quality: 100
          },{
            width: 330,
            name: "large",
            quality: 80
          },{
            width: 660,
            name: "large",
            suffix: "_x2",  // retina gfx
            quality: 50
          }]
        },
        files: [{
          expand: true,
          src: ['custom_options/**.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      pixel_sizes: {
        options: {
          sizes: [{
              aspectRatio: false,
              width: '10px'
            },{
              aspectRatio: false,
              height: '50px',
              width: '50px'
            },{
              aspectRatio: false,
              height: '500px',
              width: '200px'
            }]
        },
        files: [{
          expand: true,
          src: ['pixel_sizes/**/*.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      pixel_sizes_custom_unit: {
        options: {
          units: {
            pixel: 'abc123'
          },
          sizes: [{
            aspectRatio: false,
            width: '20px',
          },{
            aspectRatio: false,
            height: '50px',
            width: '80px',
          },{
            aspectRatio: false,
            height: '500px',
            width: '500px'
          }]
        },
        files: [{
          expand: true,
          src: ['pixel_sizes_custom_unit/**/*.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      percentage_sizes: {
        options: {
          sizes: [{
            width: '10%',
          },{
            height: '50%',
            width: '50%',
          },{
            height: '80%',
            width: '200%'
          }]
        },
        files: [{
          expand: true,
          src: ['percentage_sizes/**/*.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      percentage_sizes_custom_unit: {
        options: {
          units: {
            percentage: 'abc123'
          },
          sizes: [{
            width: '10%',
          },{
            height: '50%',
            width: '50%',
          },{
            height: '80%',
            width: '200%'
          }]
        },
        files: [{
          expand: true,
          src: ['percentage_sizes_custom_unit/**/*.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      custom_multiply_unit: {
        options: {
          units: {
            multiply: 'abc123'
          },
          sizes: [{
            width: '10%',
          },{
            height: '50%',
            width: '50%',
          },{
            height: '450px',
            width: '800px'
          }]
        },
        files: [{
          expand: true,
          src: ['custom_multiply_unit/**/*.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      custom_dest_width: {
        options: {
          sizes: [{
            aspectRatio: false,
            upscale: true,
            width: 320
          },{
            aspectRatio: false,
            upscale: true,
            width: 640
          },{
            aspectRatio: false,
            upscale: true,
            width: 1024
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.{jpg,gif,png}'],
          cwd: 'test/assets/custom_dest_width/',
          custom_dest: 'tmp/custom_dest_width/{%= width %}/'
        }]
      },
      custom_dest_name: {
        options: {
          sizes: [{
            width: 100,
            name: "leo"
          },{
            width: 200,
            name: "donnie"
          },{
            width: 400,
            name: "raph"
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.{jpg,gif,png}'],
          cwd: 'test/assets/custom_dest_name/',
          custom_dest: 'tmp/custom_dest_name/{%= name %}/'
        }]
      },
      custom_dest_path: {
        options: {
          sizes: [{
            width: 320
          },{
            width: 640
          },{
            width: 1024
          }]
        },
        files: [{
          expand: true,
          src: ['**/*.{jpg,gif,png}'],
          cwd: 'test/assets/custom_dest_path/',
          custom_dest: 'tmp/custom_dest_path/{%= width %}/{%= path %}'
        }]
      },
      rename: {
        options: {
          sizes: [{
            width: "100%",
            name: "unchanged",
            rename: false
          },{
            width: "50%",
            name: "half"
          }]
        },
        files: [{
          expand: true,
          src: ['rename/**.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      filters: {
        options: {
          sizes: [{
            filter: 'Point',
            upscale: true,
            width: 320
          },{
            filter: 'Point',
            upscale: true,
            width: 640
          },{
            filter: 'Point',
            upscale: true,
            width: 1024
          }]
        },
        files: [{
          expand: true,
          src: ['filters/**/*.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      },
      global_quality: {
        options: {
          quality: 80,
          sizes: [{
            width: 320
          },{
            width: 640
          },{
            width: 1024
          }]
        },
        files: [{
          expand: true,
          src: ['global_quality/**/*.{jpg,gif,png}'],
          cwd: 'test/assets/',
          dest: 'tmp/'
        }]
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/**/*_test.js']
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
