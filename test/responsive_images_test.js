/**
 * grunt-responsive-images
 * https://github.com/andismith/grunt-responsive-images
 *
 * Copyright (c) 2013 andismith
 * Licensed under the MIT license.
 *
 * Test suite for Grunt Responsive Images
 *
 * @author Andi Smith (http://twitter.com/andismith)
 * @version 1.0
 */


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

(function() {
  'use strict';

  var async = require('async');
  var gm    = require('gm');
  var grunt = require('grunt');
  var q = require('q');

  /**
   * Compare the created image against the expected image.
   *
   * @private
   * @param   {string}  filename  The name of the file
   * @param   {string}  actual    The actual file path
   * @param   {string}  expected  The expected file path
   * @return  {object}  promise   Either resolved rejected with an error message.
   */
  var compareImageProperties = function(filename, actualPath, expectedPath) {
    var deferred = q.defer();
    
    // load created image
    gm(actualPath + filename).identify(function(error, actualProp) {
      if (error) {
        deferred.reject('Failed to load actual (created) image "' + actualPath + filename + '"');
      } else {
        // load expected image
        gm(expectedPath + filename).identify(function(error, expectedProp) {
          if (error) {
            deferred.reject('Failed to load expected image "' + expectedPath + filename + '"');
          } else {
            // check if we have a match
            if ((actualProp.Compression === expectedProp.Compression) &&
              (actualProp.size.width === expectedProp.size.width) &&
              (actualProp.size.height === expectedProp.size.height) &&
              (actualProp['JPEG-Quality'] === expectedProp['JPEG-Quality'])) {
              deferred.resolve(true);
            } else {
              deferred.reject(filename + ': ' +
                'actual image (' + actualProp.compression + ' ' + actualProp.size.width +
                'x' + actualProp.size.height + ' - Q:' + actualProp.quality +
                ') and ' +
                'expected image (' + expectedProp.compression + ' ' + expectedProp.size.width +
                'x' + expectedProp.size.height + ' - Q:' + expectedProp.quality +
                ') should match');
            }
          }   
        });
      }
    });
    return deferred.promise;
  };

  /**
   * Inspect and handle test results from inspecting an image
   *
   * @private
   * @param   {object}  file      The file object
   * @param   {object}  test      Test instance
   * @param   {string}  callback  Async callback, to be run when the test is complete
   */
  var inspectImage = function(file, test, callback) {
    compareImageProperties(file.filename, file.actual, file.expected)
    .then(function(result) {
      test.ok(true);
    }, function(error) {
      test.ok(false, error);
    })
    .done(function() {
      return callback();
    });
  };

  /**
   * Run through the array of files and add them to the queue of images to be tested
   *
   * @private
   * @param   {array}   files     List of files to check (with filename, expected and actual paths)
   * @param   {object}  test      Test instance
   */
  var checkImages = function(actual, expected, files, test) {
    var series = [],
        file = {};
    
    test.expect(files.length);

    files.forEach(function(filename) {
      var file = {
        actual: actual,
        expected: expected,
        filename: filename
      };

      series.push(function(callback) {
        inspectImage(file, test, callback);
      });
    });

    async.series(series, function() {
      test.done();
    });
  };

  
  // List of tests to be run
  exports.responsive_images = {
    default_options: function(test) {
      var actualPath = 'tmp/default_options/',
          expectedPath = 'test/expected/default_options/',
          files = [
            'minions-small.jpg',
            'minions-medium.jpg',
            'minions-large.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    file_wildcard_options: function(test) {
      var actualPath = 'tmp/file_wildcard_options/',
          expectedPath = 'test/expected/file_wildcard_options/',
          files = [
            'sonic-small.png',
            'sonic-medium.png',
            'sonic-large.png',
            'mario-yoshi-small.jpg',
            'mario-yoshi-medium.jpg',
            'mario-yoshi-large.jpg',
            'mickey-mouse-small.gif',
            'mickey-mouse-medium.gif',
            'mickey-mouse-large.gif'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    custom_options: function(test) {
      var actualPath = 'tmp/custom_options/',
          expectedPath = 'test/expected/custom_options/',
          files = [
            'panther-small.jpg',
            'panther-220.jpg',
            'panther-large.jpg',
            'panther-large_x2.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    pixel_sizes: function(test) {
      var actualPath = 'tmp/pixel_sizes/',
          expectedPath = 'test/expected/pixel_sizes/',
          files = [
            'magikarp-10.png',
            'magikarp-50x50.png',
            'magikarp-200x500.png',
            'meowth-10.jpg',
            'meowth-50x50.jpg',
            'meowth-200x500.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    pixel_sizes_custom_unit: function(test) {
      var actualPath = 'tmp/pixel_sizes_custom_unit/',
          expectedPath = 'test/expected/pixel_sizes_custom_unit/',
          files = [
            'popeye-20abc123.jpg',
            'popeye-80abc123x50abc123.jpg',
            'popeye-500abc123x500abc123.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    percentage_sizes: function(test) {
      var actualPath = 'tmp/percentage_sizes/',
          expectedPath = 'test/expected/percentage_sizes/',
          files = [
            'captain-planet-10pc.jpg',
            'captain-planet-50pcx50pc.jpg',
            'captain-planet-200pcx80pc.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    percentage_sizes_custom_unit: function(test) {
      var actualPath = 'tmp/percentage_sizes_custom_unit/',
          expectedPath = 'test/expected/percentage_sizes_custom_unit/',
          files = [
            'transformers-10abc123.jpg',
            'transformers-50abc123x50abc123.jpg',
            'transformers-200abc123x80abc123.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    custom_multiply_unit: function(test) {
      var actualPath = 'tmp/custom_multiply_unit/',
          expectedPath = 'test/expected/custom_multiply_unit/',
          files = [
            'scooby-doo-10pc.jpg',
            'scooby-doo-50pcabc12350pc.jpg',
            'scooby-doo-800abc123450.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    custom_dest_width: function(test) {
      var actualPath = 'tmp/custom_dest_width/',
          expectedPath = 'test/expected/custom_dest_width/',
          files = [
            '320/cedric_sneer.jpg',
            '640/cedric_sneer.jpg',
            '1024/cedric_sneer.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    custom_dest_name: function(test) {
      var actualPath = 'tmp/custom_dest_name/',
          expectedPath = 'test/expected/custom_dest_name/',
          files = [
            'leo/tmnt.png',
            'donnie/tmnt.png',
            'raph/tmnt.png'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    custom_dest_path: function (test) {
      var actualPath = 'tmp/custom_dest_path/',
          expectedPath = 'test/expected/custom_dest_path/',
          files = [
            '320/battle-cat.jpg',
            '640/sub_directory/battle-dog.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    rename: function(test) {
      var actualPath = 'tmp/rename/',
        expectedPath = 'test/expected/rename/',
        files = [
          'minions.jpg',
          'minions-half.jpg'
        ];

      checkImages(actualPath, expectedPath, files, test);
    },
    filters: function(test) {
      var actualPath = 'tmp/filters/',
          expectedPath = 'test/expected/filters/',
          files = [
            'yoshi-320.png',
            'yoshi-640.png',
            'yoshi-1024.png'
          ];

      checkImages(actualPath, expectedPath, files, test);
    },
    global_quality: function(test) {
      var actualPath = 'tmp/global_quality/',
          expectedPath = 'test/expected/global_quality/',
          files = [
            'night_garden-320.jpg',
            'night_garden-640.jpg',
            'night_garden-1024.jpg'
          ];

      checkImages(actualPath, expectedPath, files, test);
    }
  };

  // It works! I finally invent something that works!

}());
