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

::: warning Experimental method
It may change its name or may be deleted in the future.
:::

This method [refreshes cropper](/introduction/under-the-hood.html#refresh-image). This method is called on every window resize and can be
useful if external container width is changed, but window's size isn't changed.

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


### `areaClass`
Default: `''`

The optional class name for the area. Probably you should not use this prop.


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

This parameter sets different restrictions of an image position:
- `area` prevents resizing and moving the image beyond the area
- `stencil` prevents resizing and moving the image beyond the stencil
- `none` allows free resizing and moving the image

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

### `touchMove`
Default: `true`

The flag that indicates if image should be dragged by a touch

### `touchResize`
Default: `true`

The flag that indicates if image should be resized by a pinch gesture

### `mouseMove`
Default: `true`

The flag that indicates if image should be dragged by a mouse

### `wheelResize`
Default: `true`

The flag that indicates if image should be resized by a mouse wheel

### `defaultPosition`
Default: `core.defaultPosition`

The static function that accepts the only argument, the object with following fields:
- `coordinates` (`{ width, height }`),
- `visibleArea` (`{ left, top, width, height }`),

It should return an object with `left` and `top` fields, i.e. default position of the stencil (relative to original image size)

### `defaultSize`
Default: `core.defaultSize`

The static function that accepts the only argument, the object with following fields:
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
