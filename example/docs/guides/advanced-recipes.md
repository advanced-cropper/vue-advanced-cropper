---
title: Advanced Recipes
---

# Advanced Recipes


## Fixed stencil

There is the example of a fixed stencil below, that may be useful for mobile devices.
<mobile-fixed-example></mobile-fixed-example>

```html
<cropper
	src="https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
	:stencil-size="{
		width: 300,
		height: 300
	}"
	:stencil-props="{
		handlers: {},
		movable: false,
		resizable: false,
		aspectRatio: 1,
	}"
    image-restriction="stencil"
/>
```

## Default size and position

Sometime you should set the default position and default size of cropper. For example, if you automatically detect an user face.

<default-positioning-example></default-positioning-example>

Notice, you can use either a function or object to set the default position and size. 

The function:
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
The object:

```html
<cropper
	:src="https://images.unsplash.com/photo-1527199372136-dff50c10ea34?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80"
	:default-position="{
		left: 100,
		top: 100
	}"
	:default-size="{
		width: 400,
		height: 400
	}"
/>
```

### Fill the image

The `default-size` prop can determine the default size based on `imageSize`, `visibleArea`, `stencilRatio` and `sizeRestrictions`  as mentioned in [its documentation](/components/cropper.html#defaultsize).

It can be used to force the cropper fills all visible area by default:

```js
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	methods: {
		defaultSize({ imageSize, visibleArea }) {
			return {
				width: (visibleArea || imageSize).width,
				height: (visibleArea || imageSize).height,
			};
		}
	}
};
```

```html
<cropper
	:src="https://images.pexels.com/photos/6524107/pexels-photo-6524107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
	:default-size="defaultSize"
/>
```

<default-filling-example></default-filling-example>



## Default visible area

Moreover, there are situations where you need to save, for example, previous visible area position, i.e. zoom or translate image.
To implement it you can use `default-visible-area` prop.

It should be noted, that visible area can be calculated either before default
coordinates calculation or after one's calculation. The priority is set by
prop [priority](/components/cropper.html#priority) that can be either `'coordinates'` (default) or `'visibleArea'`.

::: tip 
If you define only the visible area coordinates it may be easier to set priority to `visibleArea`. It eliminates the necessity
   to set default size and default position by yourself (default algorithms handle this situation).
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
				width: 800,
				height: 775,
				left: 63,
				top: 668,
			};
		}
	}
};
```


```html
<cropper
	:src="image"
	:default-visible-area="defaultVisibleArea"
	default-boundaries="fill"
	priority="visibleArea"
/>
```

## Manipulate image


There are two methods to manipulate visible area programmatically **move** and **scale**.

<manipulate-image-example></manipulate-image-example>

The minimal working example:

```html
<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css'

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

## Rotate / flip image

To rotate image use `rotate` method, it accepts the only argument: `angle` (in degrees).

::: warning Available Angles
It's strongly recommended to use an angle multiple of 90. Otherwise, the different restrictions may be broken.
:::

To flip an image use `flip` method, it accepts two boolean arguments. If first is equal to `true`
then image will be flipped horizontally, if the second is equal to `true` then image will be flipped vertically and etc.

<rotate-image-example></rotate-image-example>

The minimal working example:

```html
<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css'

export default {
	components: {
		Cropper,
	},
	methods: {
		flip(x,y) {
			this.$refs.cropper.flip(x,y);
		},
		rotate(angle) {
			this.$refs.cropper.rotate(angle);
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

## Adjust Stencil

Adjust stencil is the one of [`resizeImage`](/components/cropper.html#resizeimage) prop option.
By default it's enabled. It makes cropper more convenient especially when you have the limitations of width / height, 
but you probably shouldn't  use it if you have fixed stencil, because it will change its size. 

Try to resize image when `adjustStencil` is disabled and enabled to feel the difference.

<adjust-stencil-example></adjust-stencil-example>


## Different image restrictions

You are able to set different the restrictions of an image position by passing the following string to the `imageRestriction` prop:
- `fill-area` fill area by image and prevents resizing and moving the image beyond the area
- `fit-area` fit image to area and prevents resizing and moving the image beyond the area as much as possible ([example](/introduction/news.html#new-image-restriction-type-borders))
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
import 'vue-advanced-cropper/dist/style.css'

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


## Custom size restrictions

There may be situations, when you need to set the minimum and maximum sizes, for example, in percents, not in pixels. In that situations you should redefine the `sizeRestrictionsAlgorithm` functions by passing your custom function as [a corresponding prop](/components/cropper.html#sizeretrictionsalgorithm)


<custom-restrictions-example></custom-restrictions-example>
 
```js
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	methods: {
		percentsRestriction({ minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight }) {
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
	:min-height="400"
	:min-width="400"
	:size-restrictions-algorithm="pixelsRestriction"
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
			class="cropper"
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

## Dynamic cropper size

There are situations, when a cropper container size is changed. It's
can't be handle by cropper itself, because it doesn't know about this changes at all (in contradistinction to window's resize),
so you should call [refresh](/components/cropper.html#refresh) method.

::: tip 
This situation may seems unlikely, but in fact if your cropper was in a container that was, for example, hidden by 
`display: none`, you should call `refresh` method after its appearing.
:::

There is a minimal example:
```html
<cropper ref="cropper"/>
```

```js
// On some change, that causes container's size change
this.$refs.cropper.refresh();
```


<refresh-example></refresh-example>


## Blurred background

<blurred-background-example></blurred-background-example>

```html
<div class="cropper-wrapper">
	<div :style="{backgroundImage: 'url(' + img + ')'}" class="image-background"></div>
	<cropper :src="img" background-class="cropper-background" />
</div>
```

```css
.cropper-wrapper {
	overflow: hidden;
	position: relative;
	height: 400px;
	background: black;
}
.cropper-background {
	background: none;
}
.image-background {
	position: absolute;
	width: calc(100% + 20px);
	height: calc(100% + 20px);
	left: -10px;
	top: -10px;
	background-size: cover;
	background-position: 50%;
	filter: blur(5px);
}
```
