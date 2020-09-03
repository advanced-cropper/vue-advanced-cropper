# Bounding box

::: warning
It's the service component
:::

[[toc]]

## Description

The basic component for constructing typical stencil components.

<bounding-box-example></bounding-box-example>

## Props

### `class`

The class name for root block of the bounding box component

### `handlerComponent`

The handler component. For globally registered component just pass their name here, otherwise pass the component’s options object.

### `handlers`

The object of handlers that should be visible or hidden.

Default:
```js
{
	eastNorth: true,
	north: true,
	westNorth: true,
	west: true,
	westSouth: true,
	south: true,
	eastSouth: true,
	east: true
}
```

### `handlersClasses`

The object of custom handler class names.

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

### `lineComponent`

The line component. For globally registered component just pass their name here, otherwise pass the component’s options object.

### `lines`

The object of lines that should be visible or hidden.

Default:
```js
{
	north: true,
	west: true,
	south: true,
	east: true,
}
```

### `linesClasses`

The object of custom lines class names.

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
