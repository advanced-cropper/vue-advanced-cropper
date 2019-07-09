# Circle stencil

[[toc]]

## Props

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

## Service props

::: danger Remember!
You should not pass this props to stencil, they are passed by cropper itself
:::

### `img`
Default: `null`

The link to cropping image or the image itself in base64 format

### `stencilCoordinates`
It's the object with `left`, `right`, `height` and `width` fields, that represents desirable coordinates of stencil relative to visible area. In almost all cases you may use it as default coordinates for your absolute positioned stencil.

### `resultCoordinates`

It's the object with `left`, `right`, `height` and `width` fields, that represent the absolute coordinates of cropped area relative to original image size.

In other words, this coordinates defines a exact part of original image passed to `img` prop that is cropped now.
