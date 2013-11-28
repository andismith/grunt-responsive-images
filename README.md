# grunt-responsive-images [![NPM version](https://badge.fury.io/js/grunt-responsive-images.png)](http://badge.fury.io/js/grunt-responsive-images)

> Produces images at different sizes

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-responsive-images --save-dev
```

You'll also need to install Imagemagick CLI Tools.

```shell
brew install ImageMagick
```

Once both the plugin and ImageMagick have been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-responsive-images');
```

## The "responsive_images" task

### Overview

The responsive_images task will take your source image and create images at different resolutions for use with [PictureFill](https://github.com/scottjehl/picturefill) or with [srcset](https://github.com/borismus/srcset-polyfill).

A demo of both srcset and PictureFill using Grunt Responsive Images [is available here](http://andismith.github.io/grunt-responsive-images/).

Some slides about the plugin are [available here](http://slid.es/andismith/grunt-responsive-images).

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

#### options.sizes
Type: `Array`

Default value:

```js
[{
  name: "small",
  width: 320,
  height: 240,
  quality: 1
},{
  name: "medium",
  width: 640,
  height: 480,
  quality: 1
},{
  name: "large",
  width: 1024,
  height: 768,
  quality: 1
}]
```

An array of objects containing the sizes we want to resize our image to.

If both width and height are specified, then the image will be resized and cropped.

If a `name` is specified, then the file will be suffixed with this name. e.g. my-image-small.jpg

If a `name` is not specified, then the file will be suffixed with the width and/or height. e.g. my-image-320x240.jpg

Use `suffix` for retina graphic filenames. e.g. my-image-320x240_x2.jpg

Use `quality` to change the quality of an image (0.1, 0.2 ... 0.9, 1).

#### options.separator
Type: `String`
Default value: `-`

The character used to separate the image filename from the size name.

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
          quality: 0.6
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

And the inspiration for (grunt-responsive-videos)[https://github.com/sjwilliams/grunt-responsive-videos].

Please let us know if your live site or library uses Grunt Responsive Images. We'll add our favorites.

## FAQ

* *Receiving a `fatal error: spawn ENOENT`* - Ensure Imagemagick CLI tools are installed. Try uninstalling and reinstalling them if you are having issues.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

*0.0.6*

* Added path value to custom_dest to allow for persistent directory structures (thanks to [maslen](https://github.com/maslen)
* Started list of sites using Grunt Responsive Images plugin (contact [@andismith](http://www.twitter.com/andismith) to add yours)

*0.0.5*

* Fixed issue with custom_dest names including a prefixed separator.
* Fixed issue with tallies including a prefixed separator.

*0.0.4*

* Fixed issue with quality setting not producing correct quality output. (thanks to [pdud](https://github.com/pdud)).
* Reduced the amount of logging when running the task (thanks to [tnguyen](https://github.com/tnguyen14)).
* Allowed images of different sizes to be uploaded to different directories with custom_dest (thanks to [maslen](https://github.com/maslen) and [oncletom](https://github.com/oncletom)).

*0.0.3*

* Bug fixes for Srcset and PictureFill demos

*0.0.2*

* Added srcset and PictureFill demo

*0.0.1*

* Initial Commit

## Roadmap

* The ability to resize images by a percentage of their original size.
