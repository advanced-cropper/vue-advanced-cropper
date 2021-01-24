---
title: Getting started
---

# Getting started

::: warning Important!

The latest version doesn't have `latest` tag now. I did it deliberate because some of CDN users can use this tag and their
sites will be broken and I should give them time to migrate.

So, to install the actual version point your version exactly:
```bash
npm install --save vue-advanced-cropper@1.2.3
```

Or use the special temporary tag:
```bash
npm install --save vue-advanced-cropper@release
```
:::

## Package installation
To use the package you should install it with `npm` or `yarn`
```bash
npm install -S vue-advanced-cropper@release
```
```bash
yarn add vue-advanced-cropper@release
```

Then you should add somewhere in your script file or block the import of `Cropper` component:
```js
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
```

After that [register](https://vuejs.org/v2/guide/components-registration.html) this component locally or globally.

## Minimal working example

The following example is demonstrating the using of the cropper in a custom component:
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
	Maybe you need to set the limits for the cropper sizes or its container sizes
	otherwise a cropping image will try to fill all available space
*/
.cropper {
	height: 600px;
	background: #DDD;
}
```

<getting-started-example/>

If you need to change the behavior of cropper (for example, you want to create a fixed one for mobile devices),
please read [this detailed article](/introduction/types.html) about different types of croppers.

## Using CDN

If you want to use the cropper without using, for example, different build systems you can use the CDN link, but currently the support of this method is quite limited.

[https://unpkg.com/vue-advanced-cropper@1.2.3/dist/index.umd.js](https://unpkg.com/vue-advanced-cropper@1.2.3/dist/index.umd.js)

Then add somewhere in `head` the link to this script:
```html
<script src="https://unpkg.com/vue-advanced-cropper@1.2.3/dist/index.umd.js" />
<link rel="stylesheet" href="https://unpkg.com/vue-advanced-cropper@1.2.3/dist/style.css" />
```

And you can use globally registered components: `cropper`, `circle-stencil`, `rectangle-stencil`, `simple-handler`, `simple-line`.

<iframe width="100%" height="500" src="//jsfiddle.net/norserium/38u4v9nb/embedded/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>
