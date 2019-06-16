# Rectangle stencil

[[toc]]

## Props

### `img`
Default: `null`

The link to cropping image or the image itself in base64 format

### `aspectRatio`

Define the fixed aspect ratio of the crop box. By default, the crop box is free ratio.

### `minAspectRatio`

Define the minimum aspect ratio of the crop box. By default, the crop box is free ratio.

### `maxAspectRatio`

Define the maximum aspect ratio of the crop box. By default, the crop box is free ratio.

### `classname`

The classname for root block of the stencil component. Probably you don't need to use it.

### `previewClassname`

The classname for the preview component.

### `boundingBoxClassname`

The classname for the bouding box component.  Probably you don't need to use it.

### `handlerComponent`
Default: `SimpleHandler`

The handler component. For globally registered component just pass their name here, otherwise pass the component’s options object.

### `handlers`

The object of handlers that should be visible or hidden.

For example if you pass the following object to the current prop, only handlers at  corners will be visible
```js
{
	eastNorth: true,
	north: false,
	westNorth: true,
	west: false,
	westSouth: true,
	south: false,
	eastSouth: true,
	east: false,
}
```

### `handlersClassnames`

The object of custom handler classnames.

All available classnames are listed below
```js
{
	default: 'handler',
	hover: 'handler--hover',
	eastNorth: 'handler--east-north',
	north: 'handler--north',
	westNorth: 'handler--west-north',
	west: 'handler--west',
	westSouth: 'handler--west-south',
	south: 'handler--south',
	eastSouth: 'handler--east-south',
	east: 'handler--ease',
}
```


### `lineComponent`
Default: `SimpleLine`

The line component. For globally registered component just pass their name here, otherwise pass the component’s options object.

### `lines`

The object of lines that should be visible or hidden.

For example if you pass the following object to the current prop, only top and bottom lines will be visible
```js
{
	north: true,
	west: false,
	south: true,
	east: false,
}
```

### `linesClassnames`

The object of custom lines classnames.

All available classnames are listed below
```js
{
	default: 'line',
	hover: 'line--hover',
	north: 'line--north',
	west: 'line--west',
	south: 'line--south',
	east: 'line--ease',
}
```



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


## Service props

::: danger Remember!
You should not pass this props to stencil, they are passed by cropper itself
:::

### `height`
Default: `0`

The actual height of the cropped image (relative to original image size)


### `width`
Default: `0`

The actual width ofthe cropped image (relative to original image size)


### `left`
Default: `0`

The actual left position of the cropped image (relative to original image size)


### `top`
Default: `0`

The actual top position of the cropped image (relative to original image size)


### `stencilHeight`
Default: `0`

The actual height of the stencil


### `stencilWidth`
Default: `0`

The current width of the stencil


### `stencilLeft`
Default: `0`

The actual left position of the stencil


### `stencilTop`
Default: `0`

The current top position of the stencil




