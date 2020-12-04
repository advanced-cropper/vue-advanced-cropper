---
title: News
---

# News

## Release 0.18.0

In this release were added two **experimental** features. Use them on your own risk.

### New option: `adjustStencil`

This prop activates the stencil size adjusting on manipulate image. For example,
if you enlarge the image, you reduce the coordinates size at the same time (to preserver the stencil size). 
If the coordinates size can't be reduce (due to `min-height` or `min-width` limitations) the cropper 
prevent image enlargement by default.

The new prop `adjustStencil` allows you to change this behavior: if the cropper
can't reduce / enlarge the cropper it will change the stencil size and allow to resize
image. 

```html
<cropper
	:src="img"
	:adjust-stencil="true"
/>
```

```html
<cropper
	:src="img"
	:stencil-props="{
		minAspectRatio: 1/1,
		maxAspectRatio: 1/2,
		aspectRatio: 1/1,
	}"
	stencil-component="CircleStencil"
	image-restriction="area"
	:resize-image="{
		wheel: {
			ratio: 0.1
		},
		touch: true,
		adjustStencil: true
	}"
	:move-image="{
		mouse: true,
		touch: true,
	}"
	:max-height="100"
	:min-height="100"
	:max-width="100"
	:min-width="100"
	:debounce="500"
	:canvas="true"
	:check-orientation="true"
	:defaultSize="{
		width: 100,
		height: 100
	}"
    :defaultPosition="{
        left: 1,
        top: 1,
    }"
    defaultBoundaries="fill"
/>
```
<news-adjust-stencil></news-adjust-stencil>

### New image restriction type: `borders`

The new image restriction type is intended to replace the default combination:
`image-restriction="area"` and `default-boundaries="fit"`.

The alternative combination `image-restriction="borders"` and `default-boundaries="fill"` feels more comfortable. 
Therefore I suppose it will be the new default combination in the future.


```html
<cropper
	:src="img"
	image-restriction="borders"
	default-boundaries="fill"
/>
```

<news-borders-image-restriction></news-borders-image-restriction>
