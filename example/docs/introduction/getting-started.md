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
	components: {
		Cropper
	}
})
```

```html
<div id="app">
  <cropper
	classname="cropper"
	:src="img"
	:stencilProps="{
		aspectRatio: 10/12
	}"
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
