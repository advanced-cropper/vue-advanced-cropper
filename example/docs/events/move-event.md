---
title: Move Event
---

# Move Event

This event is emitted to stencil to move a stencil. It emits, for example, by [DraggableArea]('/components/draggable-area.html) component.

This event is represented by `MoveEvent` class instance that has two fields:
- `directions` is the object with `left` and `top` fields, that tells to move stencil at `left` pixels horizontally and `top` pixels vertically

![Overview](../.vuepress/assets/home/move-event.svg)

## Example

The example of emitting the `MoveEvent`:
```js
import {MoveEvent} from 'vue-advanced-cropper'
```
```js
// For example, inside a method of your stencil
this.$emit('move', new MoveEvent({
	left: leftShift,
	top: topShift
}))
```

