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

  // TO DO:
  // * upscaling
  // * aspect ratio
  // * default sizes

  grunt.registerMultiTask('responsive_images', 'Images at various responsive sizes', function() {

    /**
     * Default options should a user not specify any sizes
     */
    var DEFAULT_OPTIONS = {
      percentageUnit: 'pc',
      pixelUnit: '',
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
        }],
      timesUnit: 'x',
      upscaling: false,
      usePixelsForPercentage: false
    };

    var done = this.async();
    var series = [];
    // Merge task-specific and/or target-specific options with these defaults.
    
    var options = this.options(DEFAULT_OPTIONS);
    var tally = {};
    var task = this;

    /**
     * Checks for a valid array, and that there are items in the array.
     *
     * @private
     * @param   {object}          obj       The object to check
     * @return  {boolean}         Whether it is a valid array with items.
     */
    var isValidArray = function(obj) {
      return (_.isArray(obj) && obj.length > 0);
    };

    /**
     * Checks for a valid width and/or height.
     * We do not need both - one is sufficient, but if a value is supplied it must be a valid value.
     * If width is a percentage, height must also be a percentage - they cannot be mixed.
     *
     * @private
     * @param   {number/string}   width     The width, either as a number or a percentage (or as undefined)
     * @param   {number/string}   height    The height, either as a number or a percentage (or as undefined)
     * @return  {boolean}         Whether the size is valid.
     */
    var isValidSize = function(width, height) {
      // Valid values = 1, '1px', '1', '1%', '1.1%', '11.11111%', '111111%'
      // Invalid values = -1, '1.1.1%', '1a', 'a1'
      var pcRegExp = /^[0-9]*\.?[0-9]+%?$/,
          pxRegExp = /^[0-9]+(?:px)?$/,
          isValid = false;

      if ((width || height)) {
        // check if we have a valid percentage value
        if (!!(width || 0).toString().match(pcRegExp) &&
          !!(height || 0).toString().match(pcRegExp)) {
          isValid = true;
        // check if we have a valid pixel value
        } else if (!!(width || 0).toString().match(pxRegExp) &&
          !!(height || 0).toString().match(pxRegExp)) {
          isValid = true;
        } else {
          grunt.log.error('Width/height value is not valid. Percentages and pixels cannot be mixed.');
        }

      } else {
        grunt.log.error('Either width and/or height must be specified.');
      }

      return isValid;
    };

    /**
     * Create a name to suffix to our file.
     *
     * @private
     * @param   {object}          properties Contains properties for name, width, height (where applicable)
     * @return  {string}          A new name
     */
    var getName = function(properties, options) {

      //name, width, height, separator, suffix

      var filename = '',
        widthUnit = '',
        heightUnit = '';

      // name takes precedence
      if (properties.name) {
        return properties.name;
      } else {
        // figure out the units for width and height (they can be different)
        widthUnit = ((properties.width || 0).toString().indexOf('%') > 0) ? options.percentageUnit : options.pixelUnit;
        heightUnit = ((properties.height || 0 ).toString().indexOf('%') > 0) ? options.percentageUnit : options.pixelUnit;

        if (properties.width && properties.height) {
          return parseFloat(properties.width) + widthUnit + options.timesUnit + parseFloat(properties.height) + heightUnit;
        } else {
          return (properties.width) ? parseFloat(properties.width) + widthUnit : parseFloat(properties.height) + heightUnit;
        }
      }

      return (properties.separator || '') + filename + (properties.suffix || '');
    };

    var addPrefixSuffix = function(value, prefix, suffix) {
      return (prefix || '') + value + (suffix || '');
    };

    /**
     * Check the target has been set up in Grunt properly.
     * Graceful handling of https://github.com/andismith/grunt-responsive-images/issues/2
     *
     * @private
     * @param   {number}          count     The file count.
     * @param   {string}          name      Name of the image.
     */
    var checkForValidTarget = function(f) {
      var test;

      try {
        test = f.src;
      } catch (exception) {
        grunt.fail.fatal('Unable to read configuration.\n' +
          'Have you specified a target? See: http://gruntjs.com/configuring-tasks');
      }
    };

    /**
     * Check if a directory exists, and create it if it doesn't.
     *
     * @private
     * @param   {string}          dirPath   The path we want to check
     */
    var checkDirectoryExists = function(dirPath) {
      if (!grunt.file.isDir(dirPath)) {
        grunt.file.mkdir(dirPath);
      }
    };

    /**
     * Removes characters from the values of the object keys specified
     *
     * @private
     * @param   {object}          obj       The object to inspect.
     * @param   {array}           keys      The keys to check the values of.
     * @param   {string}          remove    The string to remove.
     */
    var removeCharsFromObjectValue = function(obj, keys, remove) {
      var i = 0,
        l = keys.length;
      for (i = 0; i < l; i++) {
        if (obj[keys[i]] && obj[keys[i]].toString().indexOf(remove) > -1) {
          obj[keys[i]] = obj[keys[i]].toString().replace(remove, '');
        }
      }
      return obj;
    };

    /**
     * Outputs the result of the tally.
     *
     * @private
     * @param   {number}          count     The file count.
     * @param   {string}          name      Name of the image.
     */
    var outputResult = function(count, name) {
      if (count) {
        grunt.log.writeln('Resized ' + count.toString().cyan + ' ' +
          grunt.util.pluralize(count, 'file/files') + ' for ' + name);
      }
    };

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
        return grunt.fail.fatal('Size is invalid (' + s.width + ', ' + s.height + ')');
      }

      // use crop if both width and height are specified.
      if (s.width && s.height) {
        sizingMethod = 'crop';
      }

      // create a name for our image based on name, width, height
      sizeOptions.name = getName({ name: s.name, width: s.width, height: s.height }, options);

      // create an output name with prefix, suffix
      sizeOptions.outputName = addPrefixSuffix(sizeOptions.name, options.separator, s.suffix);

      tally[sizeOptions.name] = 0;

      if (task.files.length === 0) {
        grunt.fail.warn('Unable to compile; no valid source files were found.');
      } else {

        // Iterate over all specified file groups.
        task.files.forEach(function(f) {

          var extName = '',
              srcPath = '',
              baseName = '',
              dirName = '',
              dstPath = '',
              imageOptions = {};

          checkForValidTarget(f);

          extName = path.extname(f.dest);
          srcPath = f.src[0];
          baseName = path.basename(srcPath, extName); // filename without extension

          if (f.custom_dest) {
            sizeOptions.path = f.src[0].replace(new RegExp(f.orig.cwd), "").replace(new RegExp(path.basename(srcPath)+"$"), "");
            grunt.template.addDelimiters('size', '{%', '%}');
            dirName = grunt.template.process(f.custom_dest, {
              delimiters: 'size',
              data: sizeOptions
            });
            dstPath = path.join(dirName, baseName + extName);
          } else {
            dirName = path.dirname(f.dest);
            dstPath = path.join(dirName, baseName + sizeOptions.outputName + extName);
          }
          
          // more than 1 source.
          if (f.src.length > 1) {
            return grunt.fail.warn('Unable to resize more than one image in compact or files object format.\n'+
              'For multiple files please use the files array format.\nSee http://gruntjs.com/configuring-tasks');
          }

          checkDirectoryExists(path.join(dirName));

          imageOptions = {
            srcPath:  srcPath,
            dstPath:  dstPath,
            format:   extName.replace('.', '')
          };

          // remove pixels from the value so Imagemagick doesn't complain
          sizeOptions = removeCharsFromObjectValue(sizeOptions, ['width', 'height'], 'px');

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
          outputResult(tally[sizeOptions.name], sizeOptions.name);
          return callback();
        });
      }
    });

    async.series(series, done);
  });
};