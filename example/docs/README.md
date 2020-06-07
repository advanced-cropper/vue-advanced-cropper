---
home: true
layout: home-page
---

::: slot custom-stencil

```html
<script>
import {
  PreviewResult,
  BoundingBox,
  DraggableArea
} from 'vue-advanced-cropper';

export default {
  name: "MyStencil",
  components: {
    PreviewResult, BoundingBox, DraggableArea
  },
  props: [
    // Image src
    'img',
    // Coordinates of the box relative to original image size
    'resultCoordinates',
    // Stencil size desired by the cropper
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
  },
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
      <DraggableArea @move="onMove">
        <PreviewResult
          :img="img"
          :classname="classes.preview"
          :resultCoordinates="resultCoordinates"
          :stencilCoordinates="stencilCoordinates"
        />
      </DraggableArea>
    </BoundingBox>
  </div>
</template>
```
:::
