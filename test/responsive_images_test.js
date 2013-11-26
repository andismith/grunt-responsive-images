'use strict';

var grunt = require('grunt'),
    im = require('node-imagemagick'),
    async = require('async');

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

exports.responsive_images = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  default_options: function(test) {

    var actual = {},
        expected = {};

    var files = [{
          filename: 'minions-small.jpg',
          expected: 'test/expected/default_options/',
          actual: 'tmp/default_options/'
        },
        {
          filename: 'minions-medium.jpg',
          expected: 'test/expected/default_options/',
          actual: 'tmp/default_options/'
        },
        {
          filename: 'minions-large.jpg',
          expected: 'test/expected/default_options/',
          actual: 'tmp/default_options/'
        }];

    test.expect(files.length);

    for (var i = 0, l = files.length; i < l; i++) {

      actual = grunt.file.read(files[i].actual + files[i].filename);
      expected = grunt.file.read(files[i].expected + files[i].filename);
      test.equal(actual, expected, 'should be the same image.');

    }

    test.done();
  },
  file_wildcard_options: function(test) {

    var actual = {},
        expected = {},
        series = [];

    var files = [{
          filename: 'sonic-small.png',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        },
        {
          filename: 'sonic-medium.png',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        },
        {
          filename: 'sonic-large.png',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        },
        {
          filename: 'mario-yoshi-small.jpg',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        },
        {
          filename: 'mario-yoshi-medium.jpg',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        },
        {
          filename: 'mario-yoshi-large.jpg',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        },
        {
          filename: 'mickey-mouse-small.gif',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        },
        {
          filename: 'mickey-mouse-medium.gif',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        },
        {
          filename: 'mickey-mouse-large.gif',
          expected: 'test/expected/file_wildcard_options/',
          actual: 'tmp/file_wildcard_options/'
        }];

    test.expect(files.length);

    for (var i = 0, l = files.length; i < l; i++) {

      actual = grunt.file.read(files[i].actual + files[i].filename);
      expected = grunt.file.read(files[i].expected + files[i].filename);
      test.equal(actual, expected, 'should be the same image.');
      
    }

    async.series(series, test.done);

  },
  custom_options: function(test) {

    var actual = {},
        expected = {};

    var files = [{
          filename: 'panther-small.jpg',
          expected: 'test/expected/custom_options/',
          actual: 'tmp/custom_options/'
        },
        {
          filename: 'panther-220.jpg',
          expected: 'test/expected/custom_options/',
          actual: 'tmp/custom_options/'
        },{
          filename: 'panther-large.jpg',
          expected: 'test/expected/custom_options/',
          actual: 'tmp/custom_options/'
        },
        {
          filename: 'panther-large_x2.jpg',
          expected: 'test/expected/custom_options/',
          actual: 'tmp/custom_options/'
        }];

    test.expect(files.length);

    for (var i = 0, l = files.length; i < l; i++) {

      actual = grunt.file.read(files[i].actual + files[i].filename);
      expected = grunt.file.read(files[i].expected + files[i].filename);
      test.equal(actual, expected, 'should be the same image.');

    }

    test.done();
  },
  custom_dest: function(test) {

    var actual = {},
    expected = {};

    var files = [{
          filename: 'battle-cat.jpg',
          expected: 'test/expected/custom_dest/320/',
          actual:   'tmp/custom_dest/320/'
        },
        {
          filename: 'battle-cat.jpg',
          expected: 'test/expected/custom_dest/640/',
          actual:   'tmp/custom_dest/640/'
        },
        {
          filename: 'battle-cat.jpg',
          expected: 'test/expected/custom_dest/1024/',
          actual:   'tmp/custom_dest/1024/'
        }];

    test.expect(files.length);

    for (var i = 0, l = files.length; i < l; i++) {

      actual = grunt.file.read(files[i].actual + files[i].filename);
      expected = grunt.file.read(files[i].expected + files[i].filename);
      test.equal(actual, expected, 'should be the same image.');

    }

    test.done();

  },
  custom_dest_name: function(test) {

    var actual = {},
    expected = {};

    var files = [{
          filename: 'tmnt.png',
          expected: 'test/expected/custom_dest_name/leo/',
          actual:   'tmp/custom_dest_name/leo/'
        },
        {
          filename: 'tmnt.png',
          expected: 'test/expected/custom_dest_name/donnie/',
          actual:   'tmp/custom_dest_name/donnie/'
        },{
          filename: 'tmnt.png',
          expected: 'test/expected/custom_dest_name/raph/',
          actual:   'tmp/custom_dest_name/raph/'
        }];

    test.expect(files.length);

    for (var i = 0, l = files.length; i < l; i++) {

      actual = grunt.file.read(files[i].actual + files[i].filename);
      expected = grunt.file.read(files[i].expected + files[i].filename);
      test.equal(actual, expected, 'should be the same image.');

    }

    test.done();

  },
  maintain_sub_directory_structure: function (test) {

    var actual = {},
    expected = {};

    var files = [{

          filename: 'battle-cat.jpg',
          expected: 'test/expected/maintain_sub_directory_structure/320/',
          actual:   'tmp/maintain_sub_directory_structure/320/'
        },
        {
          filename: 'battle-dog.jpg',
          expected: 'test/expected/maintain_sub_directory_structure/640/sub_directory/',
          actual:   'tmp/maintain_sub_directory_structure/640/sub_directory/'
        }];

    test.expect(files.length);

    for (var i = 0, l = files.length; i < l; i++) {

      actual = grunt.file.read(files[i].actual + files[i].filename);
      expected = grunt.file.read(files[i].expected + files[i].filename);
      test.equal(actual, expected, 'should be the same image.');

    }

    test.done();
  }
};
