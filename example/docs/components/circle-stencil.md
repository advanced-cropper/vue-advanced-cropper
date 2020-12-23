# Circle Stencil

[[toc]]

## Props

### `class`

- **Type:** `String`

- **Details:**

	The class for the entire stencil.

### `movingClass`

- **Type:** `String`

- **Details:**
	
	The class that applies to the entire stencil, when user moves it.
	
### `resizingClass`

- **Type:** `String`

- **Details:**
	
	The class that applies to the entire stencil, when user resizes it.
	
### `previewClass`

- **Type:** `String`

- **Details:**
	
	The class for the preview component.


### `boundingBoxClass`

- **Type:** `String`

- **Details:**
	
	The class for the bounding box component.  Probably you don't need to use it.

### `handlerComponent`

- **Type:** `Component`

- **Default:** `SimpleHandler`

- **Details:**

	The handler component. For globally registered component just pass their name here, otherwise pass the component’s options object.

### `handlers`

- **Type:** `Object`

- **Details:** 

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

### `handlersClasses`

- **Type:** `Object`

- **Details:** 

	The object of custom handler classes.
	
	All available class names are listed below
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


### `handlersWrapperClasses`

- **Type:** `Object`

- **Details:** 

	The object of custom handler wrapper classes.
	
	All available class names are listed below
	```js
	{
		default: 'handler-wrapper',
		hover: 'handler-wrapper--hover',
		eastNorth: 'handler-wrapper--east-north',
		north: 'handler-wrapper--north',
		westNorth: 'handler-wrapper--west-north',
		west: 'handler-wrapper--west',
		westSouth: 'handler-wrapper--west-south',
		south: 'handler-wrapper--south',
		eastSouth: 'handler-wrapper--east-south',
		east: 'handler-wrapper--ease',
	}
	```


### `lineComponent`

- **Type:** `Component`

- **Default:** `SimpleLine`

- **Details:** 

	The line component. For globally registered component just pass their name here, otherwise pass the component’s options object.

### `lines`

- **Type:** `Object`

- **Details:** 

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

### `linesClasses`

- **Type:** `Object`

- **Details:** 

	The object of custom lines classes.
	
	All available class names are listed below
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
### `linesWrapperClasses`

- **Type:** `Object`

- **Details:** 

	The object of custom lines wrapper classes.
	
	All available class names are listed below
	```js
	{
		default: 'line-wrapper',
		hover: 'line-wrapper--hover',
		north: 'line-wrapper--north',
		west: 'line-wrapper--west',
		south: 'line-wrapper--south',
		east: 'line-wrapper--ease',
	}
	```

## Service props

::: danger Remember!
You should not pass this props to stencil, they are passed by cropper itself
:::

### `image`
- **Type:** `Object`

- **Details:** 

	The object with information about the image:
	```js
	{
		src, width, height, transforms, loaded
	}
	```

### `stencilCoordinates`
- **Type:** `Object`

- **Details:** 

	It's the object with `left`, `right`, `height` and `width` fields, that represents desirable coordinates of stencil relative to visible area. In almost all cases you may use it as default coordinates for your absolute positioned stencil.

### `transitions`
- **Type:** `Boolean`

- **Details:** 

	It's the flag that indicates that transitions is allowed right now.
