---
title: Under The Hood
---

# Under The Hood

## Refresh image

::: warning Notice!
The internal process of `refreshImage` method is described below. You should not use this
method directly (use `refresh` instead, because it includes additional post process logic), but you should know what's going on under its hood.
:::

1. First of all, stretcher is initialized. By default `initStretcher` method tries to
fit to external container image completely by defining to stretcher element its width and height.

![Example](../.vuepress/assets/under-the-hood/stretching.svg)

2. Cropper waits rerender to await the changing of external container size.

3. After rerender, the cropper determines the boundaries size by calling `boundaries` method and getting its result to 
set `boundariesSize` value.

4. After boundaries is determined, the visible area coordinates is calculated by method `defaultVisibleArea`. 
The cropper always checks that visible area ratio is equal to the boundaries aspect ratio, if it's not equal,
cropper recalculates visible area height to corresponding aspect ratio of the boundaries.

5. After calculating boundaries and visible area `updateVisibleArea` methods is called. This method tries do adapt
calculated visible area on previous step to the previous `visibleArea` value, current `coordinates` and `boundariesSize`.

6. Cropper checks that coordinates fits inside visible area. If it's not cropper adapts coordinates to fit to
visible area. It may break minimum width and minimum height restrictions but it always preserve aspect ratio restrictions.

7. The internal values `visibleArea` and `coordinates` are updated.


## On resize window

1. Refresh image by `refreshImage` method.

2. Update stencil coordinates.

## On change image

The following cycle runs when image is changed.

1. If `checkOrientation` is true cropper send request to get the binary representation of image. 
If the image was received and it has `jpg` image type, the image orientation is parsed and used 
in the future.

2. After image was loaded `refreshImage` is called and image is refreshed as written above.

3. Reset coordinates.

4. Update stencil coordinates.
