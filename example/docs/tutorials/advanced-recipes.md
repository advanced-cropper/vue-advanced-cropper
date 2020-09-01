---
title: Advanced Recipes
---

# Advanced Recipes

## Custom restrictions

There may be situations, where you need to set the minimum and maximim sizes, for example, in pixels, not by percents. In that situations you should redefine the `restrictions` functions by passing your custom function as [a corresponding prop](/components/cropper.html#restrictions)


<custom-restrictions-example></custom-restrictions-example>

```js
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	methods: {
		pixelsRestriction({minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight}) {
			return {
				minWidth: minWidth,
				minHeight: minHeight,
				maxWidth: maxWidth,
				maxHeight: maxHeight,
			};
		}
	}
};
```

```html
<cropper
	:src="image"
	:restrictions="pixelsRestriction"
	:min-height="400"
	:min-width="400"
/>
```


## Fixed stencil

There is the example of a fixed stencil below, that may be useful for mobile devices.
<mobile-fixed-example></mobile-fixed-example>

```html
<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
};
</script>
```

```html
<cropper
	src="https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
	:stencil-props="{
		handlers: {},
		movable: false,
		scalable: false,
		aspectRatio: 1,
	}"
    image-restriction="stencil"
/>
```

## Different image restrictions

You are able to set different the restrictions of an image position by passing the following string to the `imageRestriction` prop:
- `area` (default) prevents resizing and moving the image beyond the area
- `stencil` prevents resizing and moving the image beyond the stencil
- `none` allows free resizing and moving the image

<image-restrictions-example></image-restrictions-example>


## Set coordinates

Usually an user changes the coordinates of a stencil, but sometimes you need to set its coordinates programmatically. There is the special method to do it: [setCoordinates](/components/cropper.html#setcoordinates-transform). It applies your changes respect to existing limitation (aspect ratios, minimum size and etc.)

<set-coordinates-example></set-coordinates-example>

The minimal working example:

```html
<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	methods: {
		resize(width, height, left, top) {
			this.$refs.cropper.setCoordinates({
				width: width,
				height: height,
				left: left,
				top: top
			})
		},
	},
};
</script>
```

```html
<cropper
	ref="cropper"
	:src="image"
/>
```

### Arguments

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
cropper.setCoordinates((coordinates, imageSize) => ({
	left: imageSize.width/2 - coordinates.width/2,
	top: imageSize.height/2 - coordinates.height/2
}))

```
2. Maximize stencil:
```js
cropper.setCoordinates((coordinates, imageSize) => ({
	width: imageSize.width,
	height: imageSize.height
}))
```

#### `Array`

Finally, there might be situations where you need to make consequence transforms. For example, resize stencil and then center it.

That can appear to be superfluous, because you can set coordinates and size simultaneosly:
```js
cropper.setCoordinates((coordinates, imageSize) => ({
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
	(coordinates, imageSize) => ({
		width: newWidth,
		height: newHeight,
	}),
	// There will be coordinates after first transformation
	(coordinates, imageSize) => ({
		left: imageSize.width/2 - coordinates.width/2,
		top: imageSize.height/2 - coordinates.height/2
	}),
])
```

## Manipulate image


There are two methods to manipulate visible area programmatically **move** and **scale**.

::: warning
This feature is not published. It's still under the development.
:::

<manipulate-image-example></manipulate-image-example>

The minimal working example:

```html
<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	methods: {
		zoom() {
			this.$refs.cropper.zoom(2);
		},
		move() {
			this.$refs.cropper.move(100, 100)
		}
	},
};
</script>
```

```html
<cropper
	ref="cropper"
	:src="image"
/>
```

### Arguments

#### `move`

Move is used to translate visible area relative to its position: 
```js
cropper.move(left, top)
```


#### `scale`

Move is used to scale visible area relative to its scale: 
```js
cropper.scale(factor, center)
```

The parameter `factor` is the number, that represents scale factor (i.e. `1.1` to resize on `110%`, `0.8` to resize to `80%`). 

The parameter `center` is the object `{ width, height }`.


## Default size and position

Sometime you should set the default position and default size of cropper. For example, if you automatically detect an user face.

<default-positioning-example></default-positioning-example>

```js
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	methods: {
		defaultPosition() {
			return {
				left: 100,
				top: 100,
			};
		},
		defaultSize() {
			return {
				width: 400,
				height: 400,
			};
		}
	}
};
```


```html
<cropper
	:src="https://images.unsplash.com/photo-1527199372136-dff50c10ea34?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
	:default-position="defaultPosition"
	:default-size="defaultSize"
/>
```

## Default visible area

Moreover, there are situations where you need to save, for example, previous visible area position. To implement
it you can use `default-visible-area` prop.
::: warning
This feature is not published. It's still under the development.
:::

<default-visible-area-example></default-visible-area-example>

```js
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	methods: {
		defaultVisibleArea() {
			return {
				width: 500,
				height: 500,
				left: 100,
				top: 100
			};
		},
	}
};
```


```html
<cropper
	:src="image"
	:default-visible-area="defaultVisibleArea"
/>
```

## Events

There are only there events now:
- `ready` when image is changed and successfully loaded (including the initial loading)
- `change` when stencil coordinates is changed (including the initial setting default coordinates)
- `error`  when images was unsuccessfully loaded (including the initial loading)

In the example below all this events are used to display the image loading indicator

<events-example></events-example>


```html
<div>
	<input v-model="img.src">
	<div class="cropper-wrapper">
		<img v-if="img.loading" class="cropper-wrapper__loading" src="./indicator.svg">
		<cropper
			classname="cropper"
			:src="img.src"
			@ready="ready"
			@error="error"
			@change="change"
		/>
	</div>
</div>
```

```js
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: {
				src: 'https://images.pexels.com/photos/1055424/pexels-photo-1055424.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
				loading: false
			}
		};
	},
	watch: {
		'img.src'(value) {
			if (value) {
				this.img.loading = true;
			}
		}
	},
	methods: {
		change({ coordinates, canvas }) {
			console.log('Coordinates was changed', coordinates, canvas);
		},
		error() {
			console.log('There is error during image loading');
			this.img.loading = false;
		},
		ready() {
			console.log('Image is successfully loaded');
			this.img.loading = false;
		}
	},
};
```
## Blurred background

<blurred-background-example></blurred-background-example>

```html
<div class="cropper-wrapper">
	<div :style="{backgroundImage: 'url(' + img + ')'}" class="cropper-background"></div>
	<cropper :src="img" />
</div>
```

```css
.cropper-wrapper {
	position: relative;
	height: 400px;
	background: black;
}
.cropper-background {
	position: absolute;
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: 50%;
	filter: blur(5px);
	opacity: 0.25;
}
```
