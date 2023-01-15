---
title: Getting started
---

# Getting started

## Package installation
To use the library you should install it with `npm` or `yarn`
::: tip Notice!
To install the Vue 2 version, use  `npm install -S vue-advanced-cropper@vue-2` instead
:::
```bash
npm install -S vue-advanced-cropper
```
```bash
yarn add vue-advanced-cropper
```

Then import the `Cropper` component:
```js
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
```

After that [register](https://vuejs.org/v2/guide/components-registration.html) the component locally or globally.

## Minimal working example

The following example shows the usage of the cropper in a custom component:
```js
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
	components: {
		Cropper,
	},
	data: {
		img: 'https://images.unsplash.com/photo-1600984575359-310ae7b6bdf2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80'
	},
	methods: {
		change({ coordinates, canvas }) {
			console.log(coordinates, canvas)
		}
	},
}
```

```html
<cropper
	class="cropper"
	:src="img"
	:stencil-props="{
		aspectRatio: 10/12
	}"
	@change="change"
/>
```
```css
/*
	It may be necessary to set limits on the size of the cropper, otherwise the cropper image will try to fill all the available space.
*/
.cropper {
	height: 600px;
	width: 600px;
	background: #DDD;
}
```

<getting-started-example></getting-started-example>

If you need to change the behavior of the cropper (for example, you want to create a fixed one for mobile devices),
please read [this detailed article](/introduction/types.html) about the different variants of croppers.

## Using CDN

### Vue 3

If you want to use the cropper without using, (for example, different build systems), you should add the code below to your page.

:::tip Notice!
Currently support for this method is limited.
:::
```html
<script src="https://unpkg.com/vue-advanced-cropper@^2.0.0/dist/index.umd.js" />
<link rel="stylesheet" href="https://unpkg.com/vue-advanced-cropper@^2.0.0/dist/style.css" />
```

To get access to components you should use the global object `VueAdvancedCropper`.

<iframe src="https://codesandbox.io/embed/vue-advanced-cropper-cdn-vue-3-0-vg46fp?autoresize=1&fontsize=14&hidenavigation=1&theme=light"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="Vue Advanced Cropper (CDN / Vue 3.0)"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>


### Vue 2

The links for the previous Vue version is slightly different:

```html
<script src="https://unpkg.com/vue-advanced-cropper@^1.0.0/dist/index.umd.js" />
<link rel="stylesheet" href="https://unpkg.com/vue-advanced-cropper@^1.0.0/dist/style.css" />
```

You can use globally registered components: `cropper`, `circle-stencil`, `rectangle-stencil`, `simple-handler`, `simple-line`.

<iframe src="https://codesandbox.io/embed/vue-advanced-cropper-cdn-vue-2-0-yfzqbt?fontsize=14&hidenavigation=1&theme=dark"
style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
title="Vue Advanced Cropper (CDN / Vue 2.0)"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
