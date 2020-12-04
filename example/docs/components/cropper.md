# Cropper

[[toc]]

## Events

### `change`

Cropper will emit `change` event on mounting, resizing the stencil, moving the stencil and changing the image.

### `ready`

Cropper will emit `ready` event when image is successfully loaded.

### `error`

Cropper will emit `error` event when image is unsuccessfully loaded.

## Methods

### `getResult()`
Returns: current coordinates, canvas and visible area.

The method that allow you to get the result of cropper programmatically, instead of listen `change` event.

It described [here](/tutorials/recipes.html#second-method).


### `setCoordinates(transform)`
Returns: new coordinates

The method that allow you to set the coordinates programmatically. The transform argument can be: `Object`, `Function` or `Array` that contains objects or function in the case if you need consequence transforms.

It described [here](/tutorials/recipes.html#second-method).

### `refresh()`

This method [refreshes cropper](/introduction/under-the-hood.html#refresh-image). This method is called on every window resize and can be
useful if the external container width is changed, but window's size isn't changed.

### `reset()`

This method resets the cropper to the initial state.

### `zoom(factor, center)`

::: warning Experimental method
It may change its name or may be deleted in the future.
:::

This methods is used to scale visible area relative to its scale.

The first parameter `factor` is the number, that represents scale factor (i.e. `1.1` to resize to `110%`, `0.8` to resize to `80%`). 

The second parameter `center` is the object `{ left, top }`.

### `move(left, top)`

::: warning Experimental method
It may change its name or may be deleted in the future.
:::

This methods is used to translate visible area relative to its position. The parameters
`left` and `top` determine the relative shift at left and top.


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


### `class`
Default: `''`

The optional class name for the root cropper block


### `imageClass`
Default: `''`

The optional class name for the cropping image


### `boundariesClass`
Default: `''`

The optional class name for the boundaries. Probably you should not use this prop.


### `backgroundClass`
Default: `''`

The optional class name for the background under the cropping image

### `debounce`
Default: `500`

The time before `change` event will be emitted after moving or resizing stencil.

### `canvas`
Default: `true`

This flag indicates if canvas should be used in cropper. If you need only the coordinates you should set `canvas = false` to get little optimization.

### `checkOrientation`
Default: `true`

The flag that indicates if EXIF orientation should be checked

### `imageRestriction`
Default: `'area'`

::: warning Notice!
Be careful when use `fit-area` setting, it's the experimental feature.
:::

This parameter sets different restrictions of an image position:
- `fill-area` fill area by image and prevents resizing and moving the image beyond the area
- `fit-area` fit image to area and prevents resizing and moving the image beyond the area as much as possible ([example](/introduction/news.html#new-image-restriction-type-borders))
- `stencil` prevents resizing and moving the image beyond the stencil
- `none` allows free resizing and moving the image

### `resizeImage`

::: warning Notice!
Be careful when you set `adjustStencil` setting, it's the experimental feature.
:::

This prop is either boolean flag or object settings. The default object:
```js
{
	touch: true,
	wheel: {
		ratio: 0.1
	},
	adjustStencil: false
}
```

The fields:
- `touch` is a flag that checks if image should be resized by a pinch gesture 
- `wheel` is either boolean flag or object (the object currently support only one option: `ratio`, i.e. speed of resizing by wheel)
- `adjustStencil` is a flag checks if stencil size can be changed during resize ([example](http://localhost:8080/vue-advanced-cropper/introduction/news.html#release-0-18-0))

Notice, that `adjustStencil` make cropper more convenient especially when you have the limitations of width / height, but you probably shouldn't
use it if you have fixed stencil, because it will change its size. 

### `moveImage`

This prop is either boolean flag or object settings. The default object:
```js
{
	touch: true,
	mouse: true
}
```

The fields:
- `touch` is a flag that checks if image should be dragged by a touch 
- `mouse` is a flag that checks if image should be dragged by a mouse 

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

### `priority`
Default: `'coordinates'`

It can be either `'coordinates'` or `'visibleArea'`. It sets the priority of initialization default values.
- If it set to `'coordinates'` the coordinates will be initialized first, but `defaultSize` and `defaultPosition` algorithms
will know nothing about visible area. 
- If it set to `'visibleArea'` then the visible area will be initialized first, but `defaultVisibleArea` algorithm
will know nothing about coordinates.

### `defaultPosition`
Default: `core.defaultPosition`

It's either an object or static function.

The object should correspond the following scheme:
```js
{
	left: 142,
	top: 73
}
```

The static function should accept the only argument, the object with following fields:
- `coordinates` (`{ width, height }`),
- `visibleArea` (`{ left, top, width, height }`),

It should return an object with `left` and `top` fields, i.e. default position of the stencil (relative to original image size)

### `defaultSize`
Default: `core.defaultSize`

It's either an object or static function.

The object should correspond the following scheme:
```js
{
	width: 142,
	height: 73
}
```

The static function should accept the only argument, the object with the following fields:
- `visibleArea` (`{ left, top, width, height }`),
- `imageSize` (`{ width, height }`),
- `stencilRatio` (`{ minimum, maximum }`)
- `sizeRestrictions` (`{ minWidth, minHeight, maxWidth, maxHeight }`)

It should return an object with `height` and `width` fields, i.e. default size of the stencil (relative to original image size)

### `defaultBoundaries`
Default: `core.defaultBoundaries`

The static function that accepts the only argument, the object with following fields:
- `cropper` (DOM Element)
- `imageSize` (`{ width, height }`),

It should return the object with `height` and `width` fields, i.e. width and height of the area.

### `sizeRestrictionsAlgorithm`
Default: `core.percentRestrictions`

The static function that accepts the only argument, the object with following fields:
- `minWidth`, `minHeight`, `maxWidth`, `maxHeight`
- `imageSize` (`{ width, height}`)

It should return the object with restrictions for stencil. For example something like this:
```js
{
	maxWidth: 2048,
	maxHeight: 2048,
	minWidth: 256,
	minHeight: 256
}
```
