---
title: Getting started
pageClass: custom
---

# Getting started
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
```html
<script>
import Vue from 'vue'
import { Cropper } from 'vue-advanced-cropper'

new Vue({
	el: '#app',
	data: {
		img: 'https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
	},
	components: {
		Cropper
	}
})

</script>

<template>
<div id="app">
  <cropper
	classname="cropper"
	:src="img"
	:stencilProps="{
		aspectRatio: 10/12
	}"
  ></cropper>
</div>
</template>

<style>
	/*
		You should set the limits for cropper sizes or its container sizes
	   	otherwise cropped image will try to fill all available space
	 */
	.cropper {
		width: 100%;
		height: 600px;
		background: #DDD;
	}
</style>
```

<getting-started-example/>
