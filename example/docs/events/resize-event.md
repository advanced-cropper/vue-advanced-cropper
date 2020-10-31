---
title: Resize Event
---

# Resize Event

This event is emitted to stencil to resize a stencil. It emits, for example, by [BoundingBox]('/components/bouding-box.html) component.

This event is represented by `ResizeEvent` class instance that has two fields:
- `directions` is the object with `left`, `right`, `bottom`, `top` fields, that tells to resize stencil at corresponding count of pixels in that sides
- `params` is the object with different params to customize resize algorithm

![Overview](../.vuepress/assets/home/resize-event.svg)

## Params

### `allowedDirections`

Default: `{left: true, right: true, top: true, bottom: true}`

It's the only directions that will be resized. If the algorithm need to resize the stencil in directions that are not allowed to save, for example, aspect ratio, it will break resize process.

### `respectDirection`

Accepted values: `height`, `width`

The primary direction that will tried to saved by algorithm during resizing stencil. By default it's `height` if height of stencil is more than its width and `width` otherwise.

### `preserveAspectRatio`

Default: `false`

The flag that tells cropper to save the current aspect ratio, even if the aspect ratio is not defined

## Example

The example of emitting the `ResizeEvent`:
```js
import { ResizeEvent } from 'vue-advanced-cropper'
```
```js
// For example, inside a method of your stencil
this.$emit('move', new ResizeEvent(
	{
		left: leftShift,
		right: rightShift,
		top: topShift,
		bottom: bottomShift,
	},
	{
		preserveAspectRatio: true
	}
))
```

