# Cropper

[[toc]]

## Events

### `change`

Cropper will emit `change` event on mounting, resizing the stencil, moving the stencil and changing the image.

The event payload is the object: `{ coordinates, image, visibleArea, canvas }`.

### `ready`

Cropper will emit `ready` event when image is successfully loaded.

### `error`

Cropper will emit `error` event when image is unsuccessfully loaded.

## Methods

### `getResult()`

- **Returns:**  
	- The object: `{ coordinates, image, visibleArea, canvas }`


- **Usage:**

	The method allows you to get the result of cropper programmatically, instead of listening the `change` event.
	
	```js
	const { 
		coordinates, image, visibleArea, canvas 
	} = this.$refs.cropper.getResult();
	```

	**See also: [Example](/guides/recipes.html#second-method)**

### `setCoordinates(transform)`

- **Arguments:**
  - `{Object|Function|Array} transform`

- **Usage:**

	The method allows you to set the coordinates programmatically. The transform argument can be: `Object`, `Function` or `Array` that contains objects or function in the case if you need consequence transforms.

	The only argument `transform` can be: `Object`, `Function` or `Array` that contains objects or function in the case if you need consequence transforms.
	
	#### `Object`
	
	If you just want to set the known coordinates you can pass object to `setCoordinates` method
	
	```js
	cropper.setCoordinates({
		width: 32,
		height: 42,
		left: 102,
		top: 74
	})
	```
	
	#### `Function`
	
	But mostly you need to set coordinates based at current coordinates or image size.
	
	1. Center stencil:
	```js
	cropper.setCoordinates(({ coordinates, imageSize }) => ({
		left: imageSize.width/2 - coordinates.width/2,
		top: imageSize.height/2 - coordinates.height/2
	}))
	
	```
	2. Maximize stencil:
	```js
	cropper.setCoordinates(({ coordinates, imageSize }) => ({
		width: imageSize.width,
		height: imageSize.height
	}))
	```
	
	#### `Array`
	
	Finally, there might be situations where you need to make consequence transforms. For example, resize stencil and then center it.
	
	That can appear to be superfluous, because you can set coordinates and size simultaneosly:
	```js
	cropper.setCoordinates(({ coordinates, imageSize }) => ({
		width: newWidth,
		height: newHeight,
		left: imageSize.width/2 - newWidth.width/2,
		top: imageSize.height/2 - newHeight.height/2
	}))
	```
	
	But there is a catch, `setCoordinates` method respects limitations, so the new width might be different than `newWidth` in this example.
	
	So the right way is do multiple consequence transforms:
	```js
	cropper.setCoordinates([
		({ coordinates, imageSize }) => ({
			width: newWidth,
			height: newHeight,
		}),
		// There will be coordinates after first transformation
		({ coordinates, imageSize }) => ({
			left: imageSize.width/2 - coordinates.width/2,
			top: imageSize.height/2 - coordinates.height/2
		}),
	])
	```

	**See also: [Example](/guides/advanced-recipes.html#set-coordinates)**
	
### `refresh()`

- **Usage:**

	This method refreshes the cropper. This method is called on every window resize and can be
	useful if the external container width is changed, but window's size isn't changed.

	**See also: [Example](/guides/advanced-recipes.html#refresh-cropper)**


### `zoom(factor, center)`

- **Arguments:**
  - `{Number} factor`
  - `{Object} [center]`

- **Usage:**
	
	This methods is used to scale visible area relative to its scale.
	
	The first parameter `factor` is the number, that represents scale factor (i.e. `1.1` to resize to `110%`, `0.8` to resize to `80%`). 
	
	The second parameter `center` is the object `{ left, top }`.
	
	**See also: [Example](/guides/advanced-recipes.html#manipulate-image)**


### `move(left, top)`

- **Arguments:**
  - `{Number} left`
  - `{Number} top`

- **Usage:**
	This methods is used to translate visible area relative to its position. The parameters
	`left` and `top` determine the relative shift at left and top.
	
	**See also: [Example](/guides/advanced-recipes.html#manipulate-image)**
	
### `rotate(angle)`

- **Arguments:**
  - `{Number} angle`

- **Usage:**
	
	This methods is used to rotate the image to a specific angle in **degrees**.
	
	**See also: [Example](/guides/advanced-recipes.html#rotate-image)**

### `flip(horizontal, vertical)`

- **Arguments:**
  - `{Boolean} horizontal`
  - `{Boolean} vertical`

- **Usage:**
	
	This methods is used to flip the image horizontally and/or vertically.
	
	**See also: [Example](/guides/advanced-recipes.html#rotate-image)**


### `reset()`

- **Usage:**

	This method resets the cropper to the initial state.


## Props

### `src`

- **Type:** `String | Null`

- **Default:** `null`

- **Details:**
	
	The link to cropping image or the image itself in base64 format

### `stencilComponent`

- **Type:** `Component`

- **Default:** `RectangleStencil`

- **Details:**

	The stencil component. For globally registered component just pass their name here, otherwise pass the component’s options object.

	**See also: [Example](/guides/recipes.html#changing-a-stencil)**
	
	
### `stencilProps`

- **Type:** `Object`

- **Default:** `{}`

- **Details:**

	The props that will be passed to the stencil component. The usual scenario is passing
	aspect ratio props [here](/components/rectangle-stencil.html#props).


### `class`

- **Type:** `String`

- **Details:**

	The optional class for the entire cropper


### `imageClass`

- **Type:** `String`

- **Details:**

	The optional class for the cropper image


### `boundariesClass`

- **Type:** `String`

- **Details:**

	The optional class for the boundaries. Probably you should not use this prop.


### `backgroundClass`

- **Type:** `String`

- **Details:**

	The optional class for the background that is placed under the cropper image.


### `foregroundClass`

- **Type:** `String`

- **Details:**

	The optional class for the foreground that is placed above the cropper image, but under the stencil.


### `debounce`

- **Type:** `Number`

- **Default:** `500`

- **Details:**

	The time before `change` event will be emitted after moving or resizing stencil.

### `stencilSize`

- **Type:** `Object | Function`

- **Details:**

	The size of the stencil in pixels (not relative to an image).
	
	#### `Object`
	
	If you just want to set the known size you can pass object to `stencilSize` prop:
	
	```js
	{
		width: 100,
		height: 100,
	}
	```
	
	#### `Function`
	
	If you need to set the stencil size based on the boundaries size, you should pass a function.
	For example:
	
	```js
	({ boundaries }) => {
		return {
			width: boundaries.width - 100,
			height: boundaries.height - 100,
		}
	}
	```
	
	**See also: [Example](/guides/advanced-recipes.html#fixed-stencil)**
	

### `canvas`

- **Type:** `Boolean | Object`

- **Default:** `true`

- **Details:**

	This prop indicates if canvas should be used in cropper and can be used also to pass some options to it.
	
	Options:
	
	- `width` - the width of the canvas (it's equal to setting of `minWidth` equal to `maxWidth`)
	- `height` - the height of the canvas (it's equal to setting of `minHeight` equal to `maxHeight`)
	- `minWidth` - the minimum width of the canvas (by default `0`)
	- `minHeight` - the minimum height of the canvas (by default `0`)
	- `maxWidth` - the maximum width of the canvas (by default `Infinity`)
	- `maxHeight` - the maximum height of the canvas (by default `Infinity`)
	- `maxArea` - the maximum width × height of the canvas (it may be useful to correspond [browser limitations](https://github.com/jhildenbiddle/canvas-size#test-results))
	- `imageSmoothingEnabled` - the [context property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled) that determines whether scaled images are smoothed (by default, `true`) 
	- `imageSmoothingQuality` - the [context property](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality) that determines the smooth quality (by default, `'high'`) 
	- `fillColor` - the color to fill alpha background (by default `transparent`)
	 
	If you need the coordinates only you should set `canvas`  to `false` to optimize performance and prevent the setting of `crossorigin` attribute to image.
	
	**See also: [Example](/guides/recipes.html#resize-the-result)**
	
### `checkOrientation`

- **Type:** `Boolean`

- **Default:** `true`

- **Details:**

	The flag that indicates if EXIF orientation should be checked


### `imageRestriction`

- **Type:** `String`

- **Default:** `'fit-area'`

- **Details:**
	
	This parameter sets different restrictions of an image position:
	- `fill-area` fill area by image and prevents resizing and moving the image beyond the area
	- `fit-area` fit image to area and prevents resizing and moving the image beyond the area as much as possible ([example](/introduction/news.html#new-image-restriction-type-borders))
	- `stencil` prevents resizing and moving the image beyond the stencil
	- `none` allows free resizing and moving the image

	**See also: [Example](/guides/advanced-recipes.html#different-image-restrictions)**
	
### `resizeImage`

- **Type:** `Boolean | Object`

- **Default:** `true`
	
- **Details:**

	This prop is either boolean flag or object settings. The default object used when `true` is passed to `resizeImage`:
	```js
	{
		touch: true,
		wheel: {
			ratio: 0.1
		},
		adjustStencil: true
	}
	```
	
	The `touch` field checks if image should be resized by a pinch gesture.
	
	The `wheel` field is either boolean flag or object. The object currently support only one option: `ratio`, i.e. speed of resizing by wheel.

	The particular attention should be focused on `adjustStencil` parameter. It enables or disables the adjusting
	of the stencil size on resize image. It makes cropper more convenient especially when you have the limitations of width / height, 
	but you probably shouldn't  use it if you have fixed stencil, because it will change its size. 

	**See also: [Example](/guides/advanced-recipes.html#adjust-stencil)**


### `moveImage`

- **Type:** `Boolean | Object`

- **Default:** `true`

- **Details:**

	This prop is either boolean flag or object settings. The default object:
    ```js
    {
    	touch: true,
    	mouse: true
    }
    ```
    
    The fields:
    - `touch` is a flag that checks if image should be moved by a touch 
    - `mouse` is a flag that checks if image should be moved by a mouse 


### `minWidth`

- **Type:** `Number`

- **Details:**

	The minimum width of the cropped coordinates in pixels

### `minHeight`

- **Type:** `Number`

- **Details:**

	The minimum height of the cropped coordinates in pixels

### `maxWidth`

- **Type:** `Number`

- **Details:**

	The maximum width of the cropped coordinates in pixels

### `maxHeight`

- **Type:** `Number`

- **Details:**

	The maximum height of the cropped coordinates in pixels

### `transitions`

- **Type:** `Boolean`

- **Default:** `true`

- **Details:**

	This flag indicates if transitions should be enabled. 
	The transitions are used during auto-zoom, rotate image, flip image, using `zoom` and `move` methods.

### `roundResult`

- **Type:** `Boolean`

- **Default:** `true`

- **Details:**

	This flag indicates if the coordinates should be rounded when you getting the result.

### `autoZoom`

- **Type:** `Boolean`

- **Default:** `false`

- **Details:**

	This flag indicates if auto-zoom should be enabled.
	
	If the auto-zoom algorithm was not redefined, there are two algorithms used.
	
	1. If `stencilSize` is not defined, the default simple auto-zoom algorithm will be used. It resizes and move visible area to
	when you setting the coordinates by `setCoordinates` method, to prevent overlap the coordinates and the visible area.
	
	2. If `stencilSize` is defined, the default fixed auto-zoom algorithm will be used. It adapts coordinates and visible area
	to fit the `stencilSize` restrictions.
	
	**See also: [Example](/guides/advanced-recipes.html#auto-zoom)**
	
### `priority`

- **Type:** `String`

- **Default:** `'coordinates'`

- **Details:**
	
	::: tip Rule of thumb
	If you set the default coordinates it's better to set `'coordinates'`, if you set the default visible area it's better to set `'visible-area'`.
	:::

	It can be either `'coordinates'` or `'visible-area'`. It sets the priority of initialization default values.
	
	#### `'coordinates'`
	The coordinates will be initialized first, but `defaultSize` and `defaultPosition` algorithms
	will know nothing about visible area. 
	
	#### `'visible-area'`
	
	The visible area will be initialized first, but `defaultVisibleArea` algorithm
	will know nothing about coordinates.

	

### `defaultPosition`

- **Type:** `Object | Function`

- **Details:**

	It's either an object or static function.
	
	#### `Object`
	
	The object should correspond the following scheme:
	```js
	{
		left: 142,
		top: 73
	}
	```
	
	#### `Function`
	
	The static function should accept the only argument, the object with following fields:
	- `visibleArea`: `{ left, top, width, height }` or `null` if the coordinates has [priority](/components/cropper.html#priority).
	- `imageSize`: `{ width, height }`,
	- `coordinates`: `{ width, height }`
	
	It should return an object with `left` and `top` fields, i.e. default position of the stencil (relative to original image size)
	
	```js
	({ visibleArea, coordinates, imageSize }) => {
		return {
			left: imageSize.width / 2 - coordinates.width / 2,
			top: imageSize.height / 2 - coordinates.height / 2,
		}
	}
	```

	**See also: [Example](/guides/advanced-recipes.html#default-size-and-position)**

### `defaultSize`

- **Type:** `Object | Function`

- **Details:**
	
	It's either an object or static function.
	
	#### `Object`
	
	The object should correspond the following scheme:
	```js
	{
		width: 142,
		height: 73
	}
	```
		
	#### `Function`
	
	The static function should accept the only argument, the object with the following fields:
	- `visibleArea`: `{ left, top, width, height }` or `null` if the coordinates has [priority](/components/cropper.html#priority).,
	- `imageSize`: `{ width, height }`,
	- `stencilRatio`: `{ minimum, maximum }`,
	- `sizeRestrictions`: `{ minWidth, minHeight, maxWidth, maxHeight }`
	
	It should return an object with `height` and `width` fields, i.e. default size of the stencil (relative to original image size)
	
	```js
	({ visibleArea, imageSize, stencilRatio, sizeRestrictions }) => {
		return {
			width: imageSize.width,
			height: imageSize.height,
		}
	}
	```
	**See also: [Example](/guides/advanced-recipes.html#default-size-and-position)**
	
### `defaultVisibleArea`

- **Type:** `Object | Function`

- **Details:**
	
	It's either an object or static function.
	
	#### `Object`
	
	::: warning Remember!
		
	The visible area always have the aspect ratio as boundaries, so if they will not be the same,
	cropper will resize the visible area vertically to fix it.
	:::
	
	The object should correspond the following scheme:
	```js
	{
		width: 200,
		height: 200,
		left: 0,
		top: 0
	}
	```
	
	#### `Function`
	
	The static function that should accept the only argument, the object with the following fields:
	- `coordinates`: `{ left, top, width, height }` or `null` if the visible area has [priority](/components/cropper.html#priority),
	- `boundaries`: `{ width, height }`,
	- `imageSize`: `{ width, height }`,
	
	It should return an object with the coordinates of visible area:
	```js
	({ coordinates, boundaries, imageSize }) => {
		return {
			left: coordinates.left - 50,
			top: coordinates.top - 50,
			width: coordinates.width + 100,
			height: coordinates.height + 100,
		}
	}
	```
	**See also: [Example](/guides/advanced-recipes.html#default-visible-area)**
	
	
### `defaultBoundaries`

- **Type:** `String | Function`

- **Default:**  `'fill'`

- **Details:**

	It's either an string or static function.
	
	#### 'String'
	
	There are available two string values:
	
	- `'fill'`, boundaries should fill the cropper
	- `'fit'`, boundaries should have the same aspect ratio as the image and should be fitted to the cropper
	
	#### 'Function'
		
	The static function that accepts the only argument, the object with following fields:
	- `cropper` (DOM Element)
	- `imageSize` (`{ width, height }`),
	
	It should return the object with `height` and `width` fields, i.e. width and height of the area.
	
	```js
	({ cropper, imageSize  }) => {
		return {
			width: cropper.clientWidth,
			height: cropper.clientHeight,
		}
	}
	```

### `sizeRestrictionsAlgorithm`

- **Type:** `Function`

- **Default:**  pixels restrictions algorithm.

- **Details:**
	
	The static function that accepts the only argument, the object with following fields:
	- `minWidth`, `minHeight`, `maxWidth`, `maxHeight`
	- `imageSize` (`{ width, height}`)
	
	It should return the object with restrictions for stencil. For example something like this:
	```js
	({ minWidth, minHeight, maxWidth, maxHeight, imageSize }) => {
		return {
			maxWidth: imageSize.width * (maxWidth || 0) / 100,
			maxHeight: imageSize.height * (maxHeight || 0) / 100,
			minWidth: imageSize.width * (minWidth || 100) / 100,
			minHeight: imageSize.height * (minHeight || 100) / 100,
		}
	}
	```
	*The example above change the interpretation of `minWidth`, `minHeight`, `maxWidth`, and `maxHeight` props. Now they
	set the limitations in percents of the image.*
