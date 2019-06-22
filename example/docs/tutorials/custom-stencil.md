---
title: Advanced stencil
---

# Advanced stencil

## Idea

There will be described creating an one of possible croppers and you can apply this ideas to arbitrary cropper.

Let's consider the following cropper:

![Internal structure](../.vuepress/assets/tutorials/custom-stencil.svg)

It's not like default stencil, at least because it has only one handler which is arranged not on the corner of a bounding box.

In addition, this cropper has different resize logic. Unlike the default stencil it expands in all directions simultaneously.

![Internal structure](../.vuepress/assets/tutorials/custom-stencil-resize.svg)

## Basic structure

A custom stencil is always a Vue component. In this tutorial we will create it as a single file component, but you may define it by any convenient way.

```html
<script>
export default {
	name: 'CircleStencil',
};
</script>

<template>
  <div class="circle-stencil"></div>
</template>

```

Let's define basic requirements to a typical stencil:
- it should receive and process service props from a cropper (`img`, `resultCoordinates`, `stencilCoordinates`)
- it should provide `aspectRatios` method that returns the object with `minimum` and `maximum` fields
- it should display the current cropped area
- it should emit resize and move events

## Props

First of all, it's need to descripe service props

### `img`

This prop is the link to image. You can use it as, for example, `src` attribute for `img`.

### `resultCoordinates`

It's the object with `left`, `right`, `height` and `width` fields, that represent the absolute coordinates of cropped area relative to original image size.

In other words, this coordinates defines a exact part of original image passed to `img` prop that is cropped now.

### `stencilCoordinates`

It's the object with `left`, `right`, `height` and `width` fields, that represents desirable coordinates of stencil relative to visible area. In almost all cases you may use it as default coordinates for your absolute positioned stencil.

You should set the coordinates of your stencil **himself**. It was done on purpose, to give you posibility to create the custom stencil more flexible.

So pay attention on the computed property `style`

```html
<script>
export default {
	name: 'CircleStencil',
	props: {
		img: {
			type: String
		},
		resultCoordinates: {
			type: Object,
		},
		stencilCoordinates: {
			type: Object,
		},
	},
	computed: {
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${left}px`,
				top: `${top}px`
			};
		}
	}
};
</script>

<template>
  <div class="circle-stencil" :style="style"></div>
</template>
```

## Aspect ratios

Aspect ratios method should return an object with `minimum` and `maximum` fields. For current stencil it's `1` and `1` because it always should be a circle, but you may set their values according to such props as `aspectRatio`, `minAspectRatio` and `maxAspectRatio`.

```html
<script>
export default {
	name: 'CircleStencil',
	props: {
		img: {
			type: String
		},
		resultCoordinates: {
			type: Object,
		},
		stencilCoordinates: {
			type: Object,
		},
	},
	methods: {
		aspectRatios() {
			return {
				minimum: 1,
				maximum: 1
			};
		}
	},
	computed: {
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${left}px`,
				top: `${top}px`
			};
		}
	}
};
</script>

<template>
  <div class="circle-stencil" :style="style"></div>
</template>

<style>
.circle-stencil {
	position: absolute;
	cursor: move;
}
</style>
```

## Handler and preview

Now we should add the preview of the cropped area and handler. To display cropped area we will use the standard `PreviewResult` component, handler is the simple img ([download it]('/assets/handler.svg)).

```html
<script>

import {PreviewResult} from 'vue-advanced-cropper'

export default {
	name: 'CircleStencil',
	components: {
		PreviewResult
	},
	props: {
		img: {
			type: String
		},
		resultCoordinates: {
			type: Object,
		},
		stencilCoordinates: {
			type: Object,
		},
	},
	methods: {
		aspectRatios() {
			return {
				minimum: 1,
				maximum: 1
			};
		}
	},
	computed: {
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${left}px`,
				top: `${top}px`
			};
		}
	}
};
</script>

<template>
  	<div class="circle-stencil" :style="style">
	 	<img src="./handler.svg">
        <PreviewResult
        	classname="circle-stencil__preview"
        	:img="img"
        	:width="stencilCoordinates.width"
        	:height="stencilCoordinates.height"
		    :coordinates="resultCoordinates"
      	/>
  	</div>
</template>

<style>
.circle-stencil {
	border-radius: 50%;
	cursor: move;
	position: absolute;
	border: dashed 2px white;
	box-sizing: border-box;
	&__handler {
		position: absolute;
		right: 15%;
		top: 14%;
		z-index: 1;
		cursor: ne-resize;
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
		transform: translate(50%, -50%);
	}
	&__preview {
		border-radius: 50%;
		overflow: hidden;
	}
}
</style>
```


## Events handling

### Preparing

You may handle drag events himself, but this library provides two very useful components for this goal: `DraggableElement` and `DraggableArea`. The first  one is used for different handlers, lines and etc, the second one is used for dragging the stencil itself.

```html
<script>

import {
	PreviewResult,
	DraggableElement,
	DraggableArea
} from 'vue-advanced-cropper'

export default {
	name: 'CircleStencil',
	components: {
		PreviewResult,
		DraggableArea,
		DraggableElement
	},
	props: {
		img: {
			type: String
		},
		resultCoordinates: {
			type: Object,
		},
		stencilCoordinates: {
			type: Object,
		},
	},
	methods: {
		aspectRatios() {
			return {
				minimum: 1,
				maximum: 1
			};
		}
	},
	computed: {
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${left}px`,
				top: `${top}px`
			};
		}
	}
};
</script>

<template>
  	<div class="circle-stencil" :style="style">
		<DraggableElement
			classname="circle-stencil__handler"
			@drag="onHandlerMove"
		>
			<img :src="require('./assets/handler.svg')">
		</DraggableElement>
		<DraggableArea @move="onMove">
			<PreviewResult
				classname="circle-stencil__preview"
				:img="img"
				:stencilCoordinates="stencilCoordinates"
				:resultCoordinates="resultCoordinates"
			/>
		</DraggableArea>
 	</div>
</template>
```


Notice, we didn't define `onMove` and `onHandlerMove` handlers. It's time to do it.

### Moving stencil (`onMove`)

This handler will be straightforward. We just emit the received `moveEvent` above.

```js
onMove(moveEvent) {
	this.$emit('move', moveEvent);
}
```


### Moving handler (`onHandlerMove`)

It's the most complicated part of creating this custom stencil. We should process the mouse / touch moving and resize our handler accordingly.

Remember, that the [resize event](/events/resize-event.html) tells cropper, how much area should be changed in all four sides: `left`, `right`, `top`, `bottom`.

![Resize event](../.vuepress/assets/home/resize-event.svg)

The draft of `onHandlerMove` method is represented below
```js
onHandlerMove(dragEvent) {
	// 1. Parsing the drag event to find out the resize factor
	// 2. Forming the resize event
}
```

#### Handling `dragEvent`

The `dragEvents` is the instance of [DragEvent](/events/drag-event.html) class. We should resize our handler in a such way that the mouse cursor will be in **the exactly same point** of handler where user started dragging. That's is what user anticipate.

Fortunately, it has method `shift` that tells us the needed shift to achieve this task
```js
onHandlerMove(dragEvent) {
	const shift = dragEvent.shift()
	const widthResize = shift.left
	const heightResize = -shift.top
}
```
Notice, that we use negative value for `heightResize` because when the top position of the handler is decreasing `shift.top` will be negative, but stencil should resize in this case.

#### Emitting `resizeEvent`

It's is pretty easy:

```js
onHandlerMove(dragEvent) {
	const shift = dragEvent.shift()
	const widthResize = shift.left
	const heightResize = -shift.top
	this.$emit('resize', new ResizeEvent(
		dragEvent.nativeEvent,
		{
			left: widthResize,
			right: widthResize,
			top: heightResize,
			bottom: heightResize,
		}
	);
}
```

## Result

<advanced-stencil-example></advanced-stencil-example>

```html
<script>
import {
	DraggableElement,
	DraggableArea,
	PreviewResult,
	ResizeEvent
} from 'vue-advanced-cropper';

export default {
	name: 'CircleStencil',
	components: {
		PreviewResult,
		DraggableArea,
		DraggableElement
	},
	props: {
		img: {
			type: String
		},
		resultCoordinates: {
			type: Object,
		},
		stencilCoordinates: {
			type: Object,
		},
	},
	computed: {
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${left}px`,
				top: `${top}px`
			};
		}
	},
	methods: {
		onMove(moveEvent) {
			this.$emit('move', moveEvent);
		},
		onHandlerMove(dragEvent) {
			const shift = dragEvent.shift();

			const widthResize = shift.left
			const heightResize = -shift.top

			this.$emit('resize', new ResizeEvent(
				dragEvent.nativeEvent,
				{
					left: widthResize,
					right: widthResize,
					top: heightResize,
					bottom: heightResize,
				}
			);
		},
		aspectRatios() {
			return {
				minimum: 1,
				maximum: 1
			};
		}
	}
};
</script>

<template>
  <div
    class="circle-stencil"
    :style="style"
  >
    <DraggableElement
      classname="circle-stencil__handler"
      @drag="onHandlerMove"
    >
      <img
        :src="require('./assets/handler.svg')"
        alt=""
      >
    </DraggableElement>
    <DraggableArea @move="onMove">
      <PreviewResult
        classname="circle-stencil__preview"
        :img="img"
		:stencilCoordinates="stencilCoordinates"
		:resultCoordinates="resultCoordinates"
      />
    </DraggableArea>
  </div>
</template>

<style lang="scss">
.circle-stencil {
  border-radius: 50%;
  cursor: move;
  position: absolute;
  border: dashed 2px white;
  box-sizing: border-box;
  &__handler {
    position: absolute;
    right: 15%;
    top: 14%;
    z-index: 1;
    cursor: ne-resize;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(50%, -50%);
  }
  &__preview {
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
```
