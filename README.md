# grunt-responsive-images

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
{
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
}
```

An array of objects containing the sizes we want to resize our image to.

If both width and height are specified, then the image will be resized and cropped.

If a `name` is specified, then the file will be suffixed with this name. e.g. my-image-small.jpg

If a `name` is not specified, then the file will be suffixed with the width and/or height. e.g. my-image-320x240.jpg

Use `suffix` for retina graphic filenames. e.g. my-image-320x240_x2.jpg

Use `quality` to change the quality of an image (0.1, 0.2 ... 0.9, 1).

#### options.seperator
Type: `String`
Default value: `-`

The character used to seperate the image filename from the size name.

### Usage Examples

#### Default Options
Using the default options will produce 3 responsive images - one at 320px wide, one at 640px wide and one at 1024px wide.

```js
grunt.initConfig({
  responsive_images: {
    options: {},
    files: {
      'dest/mario-yoshi.jpg': 'test/assets/mario-yoshi.jpg'
    }
  }
})
```

#### Custom Options
In this example, we specify our own image sizes, including a retina graphic. We also specify our files with a wildcard.

```js
grunt.initConfig({
  responsive_images: {
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
  },
})
```

### FAQ

* *Receiving a `fatal error: spawn ENOENT`* - Ensure Imagemagick CLI tools are installed. Try uninstalling and reinstalling them if you are having issues.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
