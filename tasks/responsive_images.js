/**
 * grunt-responsive-images
 * https://github.com/andismith/grunt-responsive-images
 *
 * Copyright (c) 2013 andismith
 * Licensed under the MIT license.
 *
 * Produce images at different sizes for responsive websites.
 *
 * @author Andi Smith (http://twitter.com/andismith)
 * @version 1.0
 */

'use strict';

var _     = require('lodash'),
    async = require('async'),
    im    = require('node-imagemagick'),
    path  = require('path');

module.exports = function(grunt) {

  /**
   * Default options should a user not specify any sizes
   */
  var DEFAULT_OPTIONS = {
    separator: '-',
    sizes: [{
        name: 'small',
        width: 320,
        height: 240
      },{
        name: 'medium',
        width: 640,
        height: 480
      },{
        name: 'large',
        width: 1024,
        height: 768
      }]
  };

  /**
   * Checks for a valid array, and that there are items in the array.
   *
   * @private
   * @param   {object}          obj       The object to check
   * @return  {boolean}         Whether it is a valid array with items.
   */
  function isValidArray(obj) {
    return (_.isArray(obj) && obj.length > 0);
  }

  /**
   * Checks for a valid width and/or height.
   * We do not need both - one is sufficient, but if a value is supplied it must be a valid value.
   *
   * @private
   * @param   {number/string}   width     The width, either as a number or a percentage (or as undefined)
   * @param   {number/string}   height    The height, either as a number or a percentage (or as undefined)
   * @return  {boolean}         Whether the size is valid.
   */
  function isValidSize(width, height) {
    // Valid values = 1, 1.1, '1', '1.1', '1%', '1.1%', '11.11111%', '111111%'
    // Invalid values = -1, '1.1.1%', '1a', 'a1'
    var regExp = /^[0-9]*\.?[0-9]+%?$/;

    return (!!(width || height) && // at least one value exists
      !!(width || 0).toString().match(regExp) &&
      !!(height || 0).toString().match(regExp));
  }

  /**
   * Create a name to suffix to our file.
   *
   * @private
   * @param   {string}          name       Name
   * @param   {number/string}   width      The image width
   * @param   {number/string}   height     The image height
   * @param   {string}          separator  Separator
   * @param   {string}          suffix     Suffix
   * @return  {string}          A new name
   */
  function getName(name, width, height, separator, suffix) {

    // handle empty separator as no separator
    if (typeof separator === 'undefined') {
      separator = '';
    }

    // handle empty suffix as no suffix
    if (typeof suffix === 'undefined') {
      suffix = '';
    }

    if (name) {
      return separator + name + suffix;
    } else {
      if (width && height) {
        return separator + width + 'x' + height + suffix;
      } else {
        return separator + (width || height) + suffix;
      }
    }
  }

  grunt.registerMultiTask('responsive_images', 'Images at various responsive sizes', function() {

    // Merge task-specific and/or target-specific options with these defaults.

    var done = this.async();
    var series = [];
    var options = this.options(DEFAULT_OPTIONS);
    var that = this;
    var tally = {};

    if (!isValidArray(options.sizes)) {
      return grunt.fail.warn('No sizes have been defined.');
    }

    options.sizes.forEach(function(s) {

      // consts
      var DEFAULT_SIZE_OPTIONS = {
        quality: 1
      };

      // variable
      var sizeOptions = _.clone(_.extend(DEFAULT_SIZE_OPTIONS, s));
      var sizingMethod = 'resize';

      if (!isValidSize(s.width, s.height)) {
        return grunt.fail.warn('Size is invalid (' + s.width + ', ' + s.height + ')');
      }

      // use crop if both width and height are specified.
      if (s.width && s.height) {
        sizingMethod = 'crop';
      }

      // create a name suffix for our image, called outputName so we can still use name
      sizeOptions.outputName = getName(s.name, s.width, s.height, options.separator, s.suffix);

      // set name to outputName if one does not exist
      if (typeof sizeOptions.name === 'undefined') {
        sizeOptions.name = sizeOptions.outputName;
      }

      tally[sizeOptions.name] = 0;

      if (that.files.length === 0) {
        grunt.fail.warn('Unable to compile; no valid source files were found.');
      } else {
        // Iterate over all specified file groups.
        that.files.forEach(function(f) {

          var extName = path.extname(f.dest),
              srcPath = f.src[0],
              baseName = path.basename(srcPath, extName), // filename without extension
              dirName,
              dstPath,
              subDir = "";

          if (f.custom_dest) {
            sizeOptions.path = f.src[0].replace(new RegExp(f.orig.cwd), "").replace(new RegExp(path.basename(srcPath)+"$"), "");
            grunt.template.addDelimiters('size', '{%', '%}');
            dirName = grunt.template.process(f.custom_dest, {
              delimiters: 'size',
              data: sizeOptions
            });
            dstPath = path.join(dirName, subDir, baseName + extName);
          }

          else {
            dirName = path.dirname(f.dest);
            dstPath = path.join(dirName, subDir, baseName + sizeOptions.outputName + extName);
          }

          var imageOptions = {};
          
          // more than 1 source.
          if (f.src.length > 1) {
            return grunt.fail.warn('Unable to resize more than one image in compact or files object format.\n'+
              'For multiple files please use the files array format.\nSee http://gruntjs.com/configuring-tasks');
          }

          // Make directory if it doesn't exist.
          if (!grunt.file.isDir(path.join(dirName, subDir))) {
            grunt.file.mkdir(path.join(dirName, subDir));
          }

          imageOptions = {
            srcPath:  srcPath,
            dstPath:  dstPath,
            format:   extName.replace('.', '')
          };

          // combine image options with size options.
          imageOptions = _.extend(imageOptions, sizeOptions);

          series.push(function(callback) {
            im[sizingMethod](imageOptions, function(error, stdout, stderr) {
              if (error) {
                grunt.fail.warn(error.message);
              } else {
                grunt.verbose.ok('Responsive Image: ' + srcPath + ' now '+ dstPath);
                tally[sizeOptions.name]++;
              }
              return callback();
            });
          });
        });
      
        series.push(function(callback) {
          if (tally[sizeOptions.name]) {
            grunt.log.writeln('Created ' + tally[sizeOptions.name].toString().cyan + ' files for size ' + sizeOptions.name);
          }
          return callback();
        });
      }
    });

    async.series(series, done);
  });
};
