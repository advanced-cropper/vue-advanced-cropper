---
title: Recipes
---

# Recipes

## Changing a stencil

There are only two default stencil components now, `RectangleStencil` (default) and `CircleStencil`, but you can easily create your own stencil himself.

To specify stencil component you should pass it to `stencilComponent` prop. For globally registered component just pass their name:
```html
<Cropper
	stencilComponent="CircleStencil"
/>
```

But if your component is not registered globally you should pass the component’s options object.

There is one of approaches to pass it:
```js
import Vue from 'vue'
import { Cropper, CircleStencil } from 'vue-advanced-cropper'

new Vue({
	el: '#app',
	components: {
		Cropper,
		CircleStencil
	}
})
```

```html
<div id="app">
  <Cropper
	src="https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
	:stencilComponent="$options.components.CircleStencil"
  />
</div>
```

The cause of this specificity is using the [dynamic components](https://vuejs.org/v2/guide/components.html#Dynamic-Components) approach to allow use an arbitrary stencil component.

<circle-example> </circle-example>

## Passing props to a stencil

To pass any props to stencil pass them as object to `stencilProps` prop.

```html
<Cropper
	:stencilProps="{
		minAspectRatio: 8/8,
		maxAspectRatio: 10/8
	}"
/>
```

The list of available props varies from one stencil component to another. The props of default stencils are available at this site ([RectangleStencil](/components/rectangle-stencil.html), [CircleStencil](/components/circle-stencil.html))

## Getting result

### First method

You can get the coordinates of stencil and canvas with cropped image by processing `change` event.

::: tip
Cropper will emit `change` event on mounting, resizing the stencil, moving the stencil and changing the image.
:::

<getting-result-example></getting-result-example>

```js
import Vue from 'vue'
import { Cropper } from 'vue-advanced-cropper'

new Vue({
	el: '#app',
	data() {
		return {
			coordinates: {
				width: 0,
				height: 0,
				left: 0,
				top: 0
			},
			image: null
		}
	}
	methods: {
		onChange({coordinates, canvas}) {
			this.coordinates = coordinates
			// You able to do different manipulations at a canvas
			// but there we just get a cropped image
			this.image = canvas.toDataURL()
		}
	},
	components: {
		Cropper
	}
})
```

```html
<div id="app">
  <Cropper
		src="https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg"
		@change="onChange"
  />
</div>
```

### Second method

Also there is alternative to get the cropper result. You can call the cropper method `getResult` to get current stencil coordinates and canvas with cropped image.

Click at the button **Crop Image** below to see this method in action
<getting-result-second-example/>

```js
import Vue from 'vue'
import { Cropper } from 'vue-advanced-cropper'

new Vue({
	el: '#app',
	data() {
		return {
			coordinates: {
				width: 0,
				height: 0,
				left: 0,
				top: 0
			},
			image: null
		}
	}
	methods: {
		crop() {
			const {coordinates, canvas} = this.$refs.cropper.getResult()
			this.coordinates = coordinates
			// You able to do different manipulations at a canvas
			// but there we just get a cropped image
			this.image = canvas.toDataURL()
		}
	},
	components: {
		Cropper
	}
})
```

```html
<div id="app">
  <Cropper
		src="https://images.pexels.com/photos/580012/pexels-photo-580012.jpeg"
		ref="cropper"
  />
  <button @click="crop">
	Crop
  </button>
</div>
```

## Upload image

The image uploading doesn't depend at this library and can be completed by a numerous ways. There will be considered only one of them.

That's what you will get:
<upload-example></upload-example>

```js
import Vue from 'vue'
import { Cropper } from 'vue-advanced-cropper'

new Vue({
	el: '#app',
	data() {
		return {
			image: null
		}
	},
	methods: {
		uploadImage(event) {
			// Reference to the DOM input element
			var input = event.target;
			// Ensure that you have a file before attempting to read it
			if (input.files && input.files[0]) {
					// create a new FileReader to read this image and convert to base64 format
					var reader = new FileReader();
					// Define a callback function to run, when FileReader finishes its job
					reader.onload = (e) => {
							// Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
							// Read image as base64 and set to imageData
							this.image = e.target.result;
					}
					// Start the reader job - read file as a data url (base64 format)
					reader.readAsDataURL(input.files[0]);
			}
		}
	},
	components: {
		Cropper
	}
})
```

```html
<div id="app">
	<div class="upload-example">
		<Cropper
			classname="upload-example-cropper"
			:src="image"
		/>
		<div class="button-wrapper">
			<span class="button" @click="$refs.file.click()">
				<input type="file" ref="file" @change="uploadImage($event)" accept="image/*">
				Upload image
			</span>
		</div>
	</div>
</div>
```

```css
.upload-example-cropper {
	border: solid 1px #EEE;
	height: 300px;
	width: 100%;
}

.button-wrapper {
	display: flex;
	justify-content: center;
	margin-top: 10px;
}

.button {
	color: #3fb37f;
	font-size: 16px;
	cursor: pointer;
}

.button:hover {
	font-weight: bold;
}

.button input {
	display: none;
}
```

## Blurred background

<blurred-background-example></blurred-background-example>

```html
<div class="cropper-wrapper">
	<div :style="{backgroundImage: 'url(' + img + ')'}" class="cropper-background"></div>
	<Cropper
		:src="img"
	/>
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
