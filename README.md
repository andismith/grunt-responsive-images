# grunt-responsive-images [![NPM version](https://badge.fury.io/js/grunt-responsive-images.png)](http://badge.fury.io/js/grunt-responsive-images)

> Produces images at different sizes

## Getting Started
This plugin requires Grunt `~0.4.0`.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-responsive-images --save-dev
```

You also need to install either GraphicsMagick or Imagemagick CLI tools.

**Installing GraphicsMagick (Recommended)**

If you're a Mac user and have [Homebrew](http://brew.sh/) installed, simply type:
```shell
brew install GraphicsMagick
```
Otherwise, please visit the [GraphicsMagick downloads page](http://sourceforge.net/projects/graphicsmagick/files/graphicsmagick/).


**Or installing ImageMagick**

If you're a Mac user and have [Homebrew](http://brew.sh/) installed, simply type:
```shell
brew install ImageMagick
```
Otherwise, please visit the [ImageMagick downloads page](http://www.imagemagick.org/script/binary-releases.php).

Once both the plugin and graphics engine have been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-responsive-images');
```

## Back For More?
Check the release history at the bottom of this readme for what's changed!

## The "responsive_images" task

### Overview

[Learn more about Grunt Responsive Images on the accompanying website.](http://andismith.github.io/grunt-responsive-images/)

The responsive_images task will take your source image and create images at different resolutions for use with [PictureFill](https://github.com/scottjehl/picturefill) or with [srcset](https://github.com/borismus/srcset-polyfill).

A demo of both srcset and PictureFill using Grunt Responsive Images [is available here](http://andismith.github.io/grunt-responsive-images/).

In your project's Gruntfile, add a section named `responsive_images` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  responsive_images: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

* **options.engine**<br />
  *Type:* `String`<br />
  *Default:* `gm`<br />
  *Available Values:* `gm` || `im`<br />
  *Version:* 0.1.0 and above

  Chooses which graphics engine to use when resizing images. To use GraphicsMagick, set this to `gm`. To use ImageMagick, set this to `im`. You'll need the relevant engine installed.

* **options.newFilesOnly**<br />
  *Type:* `Boolean`<br />
  *Default:* `true`<br />
  *Version:* 0.1.4 and above

  Only process files that do not already exist in the destination folder. Note this is a rather basic check for whether to process files, it does not check timestamps or file data currently. This option is useful for making the task fast during development.

* **options.sizes**<br />
  *Type:* `Array`<br />
  *Default:* `[{ name: 'small', width: 320 },{ name: 'medium', width: 640 },{ name: 'large', width: 1024 }]`<br />
  *Version:* 0.0.1 and above

  An array of objects containing the sizes and settings we want to resize our image to.

  For example:
  ```js
sizes: [{
      name: "small",
      width: 480
},{
      name: "large",
      width: 1024
  }]
```

  The settings available are as follows:

  * **width**<br />
    *Type:* `Number` or `String`<br />
    *Version:* 0.0.1 and above

    `width` can either be in pixels or percentages. Please note both width and height need to use the same units, so if width is a percentage value and you wish to specify a height this must also be a percentage.

    The following values are examples of valid widths: `1`, `'1px'`, `'1'`, `'1%'`, `'1.1%'`, `'11.11111%'`, `'111111%'`<br />
    The following values are examples of invalid values for width: `-1`, `1.1`, `1.1px`, `'1.1.1%'`, `'1a'`, `'a1'`

  * **height**<br />
    *Type:* `Number` or `String`<br />
    *Version:* 0.0.1 and above

    `height` can either be in pixels or percentages. Please note both width and height need to use the same units, so if height is a percentage value and you wish to specify a width this must also be a percentage.<br />
    `height` accepts the same values as width.

  * **name**<br />
    *Type:* `String`<br />
    *Default:* none<br />
    *Version:* 0.0.1 and above

    If a `name` is specified, then the file will be suffixed with this name. e.g. `my-image-small.jpg`<br />
    If a `name` is not specified, then the file will be suffixed with the width and/or height specified in the size options. e.g. `my-image-320x240.jpg`

  * **rename**<br />
    *Type:* `Boolean`<br />
    *Default:* `true`<br />
    *Version:* 0.1.3 and above

    If `rename` is set to `false`, then at this size the file will not be renamed, but will instead keep its original name. Suffixes will still be applied.

  * **quality**<br />
    *Type:* `Number`<br />
    *Default:* `100`<br />
    *Available Values:* `1` - `100`<br />
    *Version:* 0.0.4 and above

    JPEG format only. The quality of the image, 100 being the highest quality and 1 being the lowest.

    Please note: In versions below 0.1.0, quality is specified between 0 and 1.

  * **suffix**<br />
    *Type:* `String`<br />
    *Default:* none<br />
    *Version:* 0.0.1 and above

    Use `suffix` for retina graphic filenames. e.g. `my-image-320x240_x2.jpg`

  * **aspectRatio**<br />
    *Type:* `Boolean`<br />
    *Default:* `true`<br />
    *Available Values:* `true` || `false`<br />
    *Version:* 0.1.0 and above

    Maintains the aspect ratio of the image. The width and the height are treated as maximum values,
    so the image is expanded or contracted to fit the width and height value while maintaining the aspect ratio of the image.
    If `aspectRatio` is set to `false` and both width and height are specified, the image will be cropped.

  * **gravity**<br />
    *Type:* `String`<br />
    *Default:* `Center`<br />
    *Available Values:* `NorthWest` || `North` || `NorthEast` || `West` || `Center` || `East` || `SouthWest` || `South` || `SouthEast`<br />
    *Version:* 0.1.0 and above

    `gravity` determines the placement of the image within the crop. The default is `Center`.
    This setting only applies if an image is cropped. Cropping occurs when the aspectRatio is set to `false` and both width and height are specified.

  * **upscale**<br />
    *Type:* `Boolean`<br />
    *Default:* `false`<br />
    *Available Values:* `true` || `false`<br />
    *Version:* 0.1.0 and above.

    If the requested size is larger than the source image should the image be upscaled?

  * **filter**<br />
    *Type:* `String`<br />
    *Default:* Either `Mitchell` if the image is being enlarged, or supports a palette or matte channel. Otherwise `Lanczos.`<br />
    *Available Values:* `Point` || `Box` || `Triangle` || `Hermite` || `Hanning` || `Hamming` || `Blackman` || `Gaussian` || `Quadratic` || `Cubic` || `Catrom` || `Mitchell` || `Lanczos` || `Bessel` || `Sinc`<br />
    *Version:* 0.1.1 and above.

    `filter` effects the resizing operation of an image. Use `Point` for pixel art. [Read more about filters in the ImageMagick documentation](http://www.imagemagick.org/Usage/filter/).

  * **sample**<br />
    *Type:* `Boolean`<br />
    *Default:* false.`<br />
    *Available Values:* `true` || `false`<br />
    *Version:* 0.1.6 and above.

    Sometimes using 'sample' on PNGs may produce the same output with smaller filesizes, sometimes the output will be worse. Use this option to fine tune your images to use 'sample' instead of 'resize' where it is possible to do so.

* **options.separator**<br />
  *Type:* `String`<br />
  *Default:* `-`<br />
  *Version:* 0.0.1 and above

  The character used to separate the image filename from the size name.

* **options.units**<br />
  *Type:* `Object`<br />
  *Default:* `{ percentage: 'pc', pixel: '', multiply: 'x' }`<br />
  *Version:* 0.1.0 and above

  'units' contains the strings that should be used to represent the size units in an image 'name' when `name` has not been specified. e.g. `my-image-50pcx50pc.jpg`

  * **pixel**
    *Type:* `String`<br />
    *Default:* ``<br />
    *Version:* 0.1.0 and above

  * **percentage**
    *Type:* `String`<br />
    *Default:* `pc`<br />
    *Version:* 0.1.0 and above

    Please note `%` cannot be used as a valid character in an image name.

  * **multiply**
    *Type:* `String`<br />
    *Default:* `x`<br />
    *Version:* 0.1.0 and above

* **options.customIn**
  *Type:* `String`<br />
  *Default:* `null`<br />
  *Version:* 0.1.6 and above

Custom input arguments as specified at https://github.com/aheckmann/gm#custom-arguments

* **options.customOut**
  *Type:* `String`<br />
  *Default:* `null`<br />
  *Version:* 0.1.6 and above

Custom output arguments as specified at https://github.com/aheckmann/gm#custom-arguments

### Usage Examples

#### Default Options
Using the default options will produce 3 responsive images - one at 320px wide, one at 640px wide and one at 1024px wide.

```js
grunt.initConfig({
  responsive_images: {
    myTask: {
      options: {},
      files: {
        'dest/mario-yoshi.jpg': 'test/assets/mario-yoshi.jpg'
      }
    }
  }
})
```

#### Custom Options
In this example, we specify our own image sizes, including a retina graphic. We also specify our files with a wildcard.

```js
grunt.initConfig({
  responsive_images: {
    myTask: {
      options: {
        sizes: [{
          width: 320,
          height: 240
        },{
          name: 'large',
          width: 640
        },{
          name: "large",
          width: 1024,
          suffix: "_x2",
          quality: 60
        }]
      },
      files: [{
        expand: true,
        src: ['assets/**.{jpg,gif,png}'],
        cwd: 'test/',
        dest: 'tmp/'
      }]
    }
  },
})
```

#### Custom Destination
If you would like to output each image size to a different directory, you can do so with custom_dest. For example:

```js
grunt.initConfig({
  responsive_images: {
    myTask: {
      options: {
        sizes: [{
          width: 320,
        },{
          width: 640,
        },{
          width: 1024,
        }]
      },
      files: [{
        expand: true,
        src: ['**.{jpg,gif,png}'],
        cwd: 'test/assets/custom_dest/',
        custom_dest: 'tmp/custom_dest/{%= width %}/'
      }]
    }
  },
})
```

You can use `{%= width %}`, `{%= height %}`, `{%= name %}` or `{%= path %}` as a delimiter.

Please note that `{%= width %}`, `{%= height %}` and `{%= name %}` are only available if they are set in the object literal that you use to set each generated size option.

The `{%= path %}` value contains additional directory structure from the current working directory (cwd in files array) to each image.  Using `{%= path %}` allows any complex directory structure to persist into the rendered responsive images directory.

NOTE: for grunt-responsive-images to pick up images within subdirectories you must set your files.src property to `**/*.{jpg,gif,png}`.

## As Seen On...

The following sites and libraries are using Grunt Responsive Images (because they ROCK!):

* [BBC-News/Imager.js](https://github.com/BBC-News/Imager.js/)
* [yeoman/generator-mobile](https://github.com/yeoman/generator-mobile)

And the inspiration for [grunt-responsive-videos](https://github.com/sjwilliams/grunt-responsive-videos).

Please let us know if your live site or library uses Grunt Responsive Images. We'll add our favorites.

## FAQ

* **I'm receiving a `fatal error: spawn ENOENT` error. Any ideas?**

  Ensure either Graphicsmagick or Imagemagick tools are installed, and that you are using the correct engine in your Grunt file options. The default engine is Graphicsmagick. If you'd rather use Imagemagick, the engine value should be changed to `im` as documented above.

  Try uninstalling and reinstalling Graphicsmagick or Imagemagick if you are having issues.

* **How do I only process recently added images?**

  Use the option newFilesOnly to only produce files that do not exist.

## Release History

*0.1.5*

* Test files are no longer take up disk space.
* Improved error handling for isAnimated.
* Fixed Travis-CI build dependencies
* Files can change format
* Come with me if you want to live

*0.1.4*

* Skip images with newFilesOnly. Set this option to true and Grunt Responsive Images will check if the image has already been created before creating a new version. This is only a basic check, it doesn't check for changes in the file - only whether the file does or does not exist. A future version will also check the timestamp.
* Every option (except width and height) can be defined globally. This includes:
  * aspectRatio
  * gravity
  * quality
  * rename
  * separator
  * units
  * upscale
* Don't want to create images for larger sizes if you're not upscaling? Just set createNoScaledImage to true. And yes, you can do this globally too.
* Animated images are now skipped. This is due to ImageMagick failing on animated GIFs and GraphicsMagick adding Megabytes to their size. If you really want animated files, you can turn it back on with tryAnimated. Unfortunately, resizing animated images is just too difficult a problem for a command line tool.
* Do you want to build a snowman?

*0.1.3*

* Stop files being renamed with the new 'rename': false option.
* BEE-DO! BEE-DO!

*0.1.2*

* Quality can now be defined globally.
* If no files are found, the task will now silently fail.
* Bug fixes.
* Ipsy upsy daisy dooooo.

*0.1.1*

* Added filters, useful for changing the resizing operation.
* 100% more dinosaur.

*0.1.0*

* Added [GraphicsMagick](http://www.graphicsmagick.org/)! GraphicsMagick is now the default imaging library, although it easy to change to ImageMagick if you'd prefer.
* Added percentage re-sizing! Specify percentage sizes as strings, like this: '42%'. A percentage dimension cannot be mixed with a pixel dimension as the graphics engines do not allow it, sorry.
* Keep aspect ratios, so your images are no longer squished or cropped by default.
* More control over cropping images with gravity.
* Customise units! Added pixel (default: ''), percentage (default: 'pc') and multiply (default: 'x') units.
* Now handles missing configuration target more gracefully.
* Re-write of quite a lot of the plugin itself!
* Added nice JSDoc comments :)
* Removed height values from default. If you used the default settings, you'll need to update your configuration.
* Added Flux Capacitor.

*0.0.7*

* Added path value to custom_dest to allow for persistent directory structures.
* Started list of sites using Grunt Responsive Images plugin ([contact @andismith](http://www.twitter.com/andismith) to add yours).
* Said goodbye to the dolphins.

*0.0.5*

* Fixed issue with custom_dest names including a prefixed separator.
* Fixed issue with tallies including a prefixed separator.

*0.0.4*

* Fixed issue with quality setting not producing correct quality output.
* Reduced the amount of logging when running the task.
* Allowed images of different sizes to be uploaded to different directories with custom_dest.

*0.0.3*

* Bug fixes for Srcset and PictureFill demos

*0.0.2*

* Added srcset and PictureFill demo

*0.0.1*

* Initial Commit

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

Thanks to [all the contributors](https://github.com/andismith/grunt-responsive-images/graphs/contributors) who've submitted a pull request; and everyone who's raised issues or contributed to issue resolution.
