---
title: Getting started
---

# Getting started

::: warning Warning!
This library is in beta test stage. API can be changed in the future.
:::

## Package installation
To use the package you should install it with `npm` or `yarn`
```bash
npm install -S vue-advanced-cropper
```
```bash
yarn add vue-advanced-cropper
```

Then you should add somewhere in your script file or block the import of `Cropper` component:
```js
import Vue from 'vue'
import { Cropper } from 'vue-advanced-cropper'
```

After that [register](https://vuejs.org/v2/guide/components-registration.html) this component locally or globally.

## Minimal working example

The following example is demonstrating the using of cropper:
```js
import Vue from 'vue'
import { Cropper } from 'vue-advanced-cropper'

new Vue({
	el: '#app',
	data: {
		img: 'https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
	},
	methods: {
		change({coordinates, canvas}) {
			console.log(coordinates, canvas)
		}
	},
	components: {
		Cropper
	}
})
```

```html
<div id="app">
  <cropper
	class="cropper"
	:src="img"
	:stencil-props="{
		aspectRatio: 10/12
	}"
	@change="change"
  ></cropper>
</div>
```
``` css
/*
	Maybe you need to set the limits for the cropper sizes or its container sizes
	otherwise a cropping image will try to fill all available space
*/
.cropper {
	height: 600px;
	background: #DDD;
}
```

<getting-started-example/>

## Using CDN

If you want to use the cropper without using, for example, different build systems you can use the CDN link, but currently the support of this method is quite limited.

[https://unpkg.com/vue-advanced-cropper@latest/dist/index.umd.js](https://unpkg.com/vue-advanced-cropper@latest/dist/index.umd.js)

Then add somewhere in `head` the link to this script:
```html
<script src="https://unpkg.com/vue-advanced-cropper@latest/dist/index.umd.js" />
```

And you can use globally registered components: `cropper`, `circle-stencil`, `rectangle-stencil`, `simple-handler`, `simple-line`.

<iframe width="100%" height="500" src="//jsfiddle.net/norserium/38u4v9nb/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
