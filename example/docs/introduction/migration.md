---
title: Migration
---

# Migration to 1.0

On one hand I wish to minimize breaking-changes in this release, on the other hand,
due to beta-testing, I realize that many aspects of the library should be updated. The library has grown
much larger and more difficult to maintain, as a result breaking-changes are inevitable.

The goal of this guide is to facilitate the migration of the library to the newer versions.

## Installation

### Styles

Styles are no longer automatically injected. You should import the styles directly.

### Using Bundler

```js
import { Cropper } from 'vue-advanced-cropper';
// Add the following line to import the cropper styles
import 'vue-advanced-cropper/dist/style.css';
```

### Using CDN

```html
<script src="https://unpkg.com/vue-advanced-cropper@^1.0.0/dist/index.umd.js" />
<!-- Add the following line to import the cropper styles -->
<link rel="stylesheet" href="https://unpkg.com/vue-advanced-cropper@^1.0.0/dist/style.css" />
```

## Changed the markup of cropper

1. Background is limited by the cropper boundary now. If you set the ```background-color``` in the ```background-class``` it won't fill the entire cropper, it will fill only the area that fits in the cropper boundary. The entire cropper could be wider or taller than its boundary. To set the background for the entire cropper set the ```background-color``` in the ```class``` attribute now.

2. The foreground layer has been added. to customize it use `foreground-class`. It layers over the background and the image to darken it and sits below the stencil.

## Changed the defaults

1. The default setting for `default-boundaries` is `'fill'` now (previously `'fit'`). It seems to be a more appropriate setting for the
majority of the available croppers.

2. The default setting for `image-restriction` is `fit-area` now (previously `'fill-area'`)

3. The default setting for `size-restrictions-algorithm` has been changed: `minWidth`, `minHeight`, `maxWidth` and `maxHeight` set
the limitations in pixels now (previously limitations were set in percentages).

4. The default setting of `resizeImage` has been changed. Now `adjustStencil` is enabled by default.

## Changed props

1. Replaced `wheelResize`, `touchResize`, `touchMove`, `mouseMove` props with [`resizeImage`](/components/cropper.html#resizeimage) and [`moveImage`](/components/cropper.html#moveImage) props.

2. Renamed `classname`, `areaClassname`, `backgroundClassname`, `imageClassname`, `linesClassnames` and `classnames` to `class`, `boundariesClass`, `backgroundClass`, `imageClass`, `linesClasses` and `classes` respectively.

3. Renamed `lineComponent`, `handlerComponent` to `linesComponent`, `handlersComponent`

4. Renamed `restrictions` to `size-restrictions-algorithm`

5. The priority prop now accepts `'visible-area'` instead of `'visibleArea'`.

6. The `RectangleStencil`, `CircleStencil` and `BoundingBox` prop `scalable` were renamed to `resizable`.

## Changed methods

1. The callback in `setCoordinates` method now should accept only one argument: an object with properties `coordinates`, `imageSize` and `visibleArea`.
```js
this.$refs.cropper.setCoordinates(({ coordinates, imageSize, visibleArea}) => {
	return {
		width: visibleArea.width,
		height: visibleArea.height
	}
})
```
