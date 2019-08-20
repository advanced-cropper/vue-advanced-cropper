# Cropper

[[toc]]

## Events

### `change`

Cropper will emit `change` event on mounting, resizing the stencil, moving the stencil and changing the image.

## Methods

### `getResult()`
Returns: current coordinates and canvas

The static method that allow you to get the result of cropper programatically, instead of listen `change` event.

It described [here](/tutorials/recipes.html#second-method).


### `setCoordinates(transform)`
Returns: new coordinates

The static method that allow you to set the coordinates programatically. The transform argument can be: `Object`, `Function` or `Array` that contains objects or function in the case if you need consequence transforms.

It described [here](/tutorials/recipes.html#second-method).

## Props

### `src`
Default: `null`

The link to cropping image or the image itself in base64 format

### `stencilComponent`
Default: `RectangleStencil`

The stencil component. For globally registered component just pass their name here, otherwise pass the component’s options object.


### `stencilProps`
Default: `{}`

The props that will be passed to the stencil component


### `classname`
Default: `''`

The optional classname for the root cropper block


### `imageClassname`
Default: `''`

The optional classname for the cropping image


### `areaClassname`
Default: `''`

The optional classname for the area. Probably you should not use this prop.


### `backgroundClassname`
Default: `''`

The optional classname for the background under the cropping image

### `debounce`
Default: `500`

The time before `change` event will be emitted after moving or resizing stencil.

### `canvas`
Default: `true`

This flag indicates if canvas should be used in cropper. If you need only the coordinates you should set `canvas = false` to get little optimization.

### `checkOrientation`
Default: `true`

The flag that indicates if EXIF orientation should be checked

### `minWidth`
Default: `10`

The minimum width of the stencil in percents

### `minHeight`
Default: `10`

The minimum height of the stencil in percents

### `maxWidth`
Default: `100`

The maximum width of the stencil in percents

### `maxHeight`
Default: `100`

The maximum height of the stencil in percents

### `defaultSize`
Default: `core.defaultSize`

The static function that accepts `cropper` (DOM Element), `image` (DOM Element) and `props` (all cropper's props) and return object with `height` and `width` fields, i.e. default size of the stencil (relative to original image size)

### `defaultPosition`
Default: `core.defaultPosition`

The static function that accepts `cropper` (DOM Element), `image` (DOM Element), `width`,  `height` (size of cropper), and `props` (all cropper's props) and return object with `left` and `top` fields, i.e. default position of the stencil (relative to original image size)

### `areaSize`
Default: `core.areaSize`

The static function that accepts `cropper` (DOM Element) and `image` (DOM Element) and return the object with `height` and `width` fields, i.e. width and height of the area.

### restrictions
Default: `core.resize`

The static function that accepts `minWidth`, `minHeight`, `maxWidth`, `maxHeight`, `imageWidth`, `imageHeight` and returns the object.

For example something like that
```js
{
	maxWidth: 2048,
	maxHeight: 2048,
	minWidth: 256,
	minHeight: 256
}
```

### `resizeAlgorithm`
Default: `core.resize`

The static function that accepts `coordinates`, `restrictions`, `imageSize`, `coefficient`, `aspectRatio`, `resizeEvent` and returns the object.

For example something like that
```js
{
	width: 42,
	height: 12,
	left: 0,
	top: 0
}
```

### `moveAlgorithm`
Default: `core.move`

The static function that accepts `coordinates`, `restrictions`, `imageSize`, `coefficient`, `moveEvent` and returns the object.

For example something like that
```js
{
	width: 42,
	height: 12,
	left: 5,
	top: 5
}
```
