---
home: true
layout: home
---

::: slot custom-stencil

```html
<script>
import {
  PreviewImage,
  BoundingBox,
  MoveableArea
} from 'vue-advanced-cropper';

export default {
  name: "MyStencil",
  components: {
    PreviewImage, BoundingBox, MoveableArea
  },
  props: [
    // Image src
    'img',
    // Coordinates of box relative to original image size
    'height', 'width', 'left', 'top',
    // Stencil size desired by cropper
    'stencilHeight', 'stencilWidth',
    // Aspect ratios
    'aspectRatio', 'minAspectRatio', 'maxAspectRatio',
  ],
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
  <div class="my-stencil">
    <BoundingBox @resize="onResize">
      <MoveableArea @move="onMove">
        <PreviewImage
          :img="img"
          :previewWidth="stencilWidth"
          :previewHeight="stencilHeight"
          :width="width"
          :height="height"
          :left="left"
          :top="top"
        />
      </MoveableArea>
    </BoundingBox>
  </div>
</template>
```
:::
