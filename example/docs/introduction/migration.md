---
title: Migration
---

# Migration to 1.0

On the one hand I want to minimize the breaking-changes in this release, but on the other hand
due the beta-testing I realize that much aspects should be changed. The library have became
much larger and much difficult that it was before, so the breaking-changes became inevitable.

This goal of this guide to facilitate the migration to the new version.

## Installation

### Styles

Now the styles are not injected automatically. You should import the styles directly.

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

1. Background is limited by boundaries now. To set the background of the entire cropper set background for the entire cropper.

2. The foreground layer was added (to customize it use `foreground-class`. It lays above the background and the image, but it lays below the stencil. 
It used to dark the image.

## Changed the defaults

1. The default setting for the `default-boundaries` is `'fill'` now (was `'fit'`). It looks as more appropriate setting for the
majority of different croppers.

2. The default setting for the `image-restriction` is `fit-area` now (was `'fill-area'`)

3. The default `size-restrictions-algorithm` is changed: `minWidth`, `minHeight`, `maxWidth` and `maxHeight` set
the limitations in the pixels now (before they set limitations in the percents).

4. The default settings of `resizeImage` is changed. Now `adjustStencil` is enabled by default.

## Changed props

1. Replaced `wheelResize`, `touchResize`, `touchMove`, `mouseMove` props by [`resizeImage`](/components/cropper.html#resizeimage) and [`moveImage`](/components/cropper.html#moveImage) props.

2. Renamed `classname`, `areaClassname`, `backgroundClassname`, `imageClassname`, `linesClassnames` and `classnames` to `class`, `boundariesClass`, `backgroundClass`, `imageClass`, `linesClasses` and `classes` respectively.

3. Renamed `lineComponent`, `handlerComponent` to `linesComponent`, `handlersComponent`

4. Renamed `restrictions` to `size-restrictions-algorithm`

5. The priority prop now accepts `'visible-area'` instead of `'visibleArea'`.

6. The `RectangleStencil`, `CircleStencil` and `BoundingBox` prop `scalable` was renamed to `resizable`. 

## Changed methods

1. The callback in `setCoordinates` method now should accept only one argument: the object with fields `coordinates`, `imageSize` and `visibleArea`. 
```js
this.$refs.cropper.setCoordinates(({ coordinates, imageSize, visibleArea}) => {
	return {
		width: visibleArea.width,
		height: visibleArea.height
	}
})
```
