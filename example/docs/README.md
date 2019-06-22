---
home: true
layout: home
---

::: slot custom-stencil

```html
<script>
import {
  PreviewResult,
  BoundingBox,
  MoveableArea
} from 'vue-advanced-cropper';

export default {
  name: "MyStencil",
  components: {
    PreviewResult, BoundingBox, MoveableArea
  },
  props: [
    // Image src
    'img',
    // Coordinates of box relative to original image size
    'resultCoordinates',
    // Stencil size desired by cropper
    'stencilCoordinates',
    // Aspect ratios
    'aspectRatio', 'minAspectRatio', 'maxAspectRatio',
	],
	computed: {
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${left}px`,
				top: `${top}px`
			};
		}
	}
  methods: {
    onMove(moveEvent) {
      this.$emit('move', moveEvent)
    },
    onResize(resizeEvent) {
      this.$emit('resize', resizeEvent)
    },
    aspectRatios() {
      return {
          minimum: this.aspectRatio || this.minAspectRatio,
          maximum: this.aspectRatio || this.maxAspectRatio,
        }
    }
  },
};
</script>

<template>
  <div class="my-stencil" :style="style">
    <BoundingBox @resize="onResize">
      <MoveableArea @move="onMove">
        <PreviewResult
          :img="img"
          :classname="classes.preview"
		  		:resultCoordinates="resultCoordinates"
		  		:stencilCoordinates="stencilCoordinates"
        />
      </MoveableArea>
    </BoundingBox>
  </div>
</template>
```
:::
