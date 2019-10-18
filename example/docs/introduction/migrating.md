# Upgrading to v.1.x.x

## The props changes:

### `areaSize`

The function passed to this prop should accept the only argument an object: `{ cropper, image, imageWidth, imageHeight }`

### `defaultSize`

The function passed to this prop should accept the only argument an object: `{	cropper, image, minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight, props }`

### `defaultPosition`

The function passed to this prop should accept the only argument an object: `{ cropper, image, stencilWidth, stencilHeight, imageWidth, imageHeight,  props }`

### `percentRestrictions`

The function passed to this prop should accept the only argument an object: `{ minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight }`
