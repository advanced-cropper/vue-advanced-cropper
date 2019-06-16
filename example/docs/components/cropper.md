# Cropper

[[toc]]

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

### `resizeAlgorithm`
Default: `core.resize`

The static function that accepts `coorditanes`, `restrictions`, `imageSize`, `coefficient`, `aspectRatio`, `resizeEvent` and returns the object.

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

The static function that accepts `coorditanes`, `restrictions`, `imageSize`, `coefficient`, `moveEvent` and returns the object.

For example something like that
```js
{
	width: 42,
	height: 12,
	left: 5,
	top: 5
}
```
