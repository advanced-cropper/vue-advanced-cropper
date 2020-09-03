<template>
  <Cropper
    :src="require('./assets/image.jpg')"
    class="common-example"
    :stencil-props="{
      aspectRatio: 10/12,
      class: 'common-example__stencil',
      previewClass: 'common-example__preview',
      linesClasses: {
        default: 'common-example__line',
        hover: 'common-example__line--hover',
      },
      handlersClasses: {
        default: 'common-example__handler',
        over: 'common-example__handler--hover',
      }
    }"
  />
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	name: 'CommonExample',
	components: {
	  Cropper,
	},
};
</script>

<style lang="scss">
.common-example {
  background: black;
  &__stencil {
    background: white;
    &:after, &:before {
      content: "";
      opacity: 0.3;
      position: absolute;
      pointer-events: none;
      z-index: 1;
    }
    &:after {
      border-left: dashed 1px #eee;
      border-right: dashed 1px #eee;
      width: 33%;
      height: 100%;
      transform: translateX(-50%);
      left: 50%;
      top: 0;
    }
    &:before {
      border-top: dashed 1px #eee;
      border-bottom: dashed 1px #eee;
      height: 33%;
      width: 100%;
      transform: translateY(-50%);
      top: 50%;
      left: 0;
    }
  }
  &__preview {
    opacity: 0.9;
    &:after {
      content: "+";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.5;
      color: white;
    }
  }
  &__line {
    border-color: white;
  }
  &__handler {
    width: 5px;
    height: 5px;
    background: white;
    opacity: 0.75;
  }
}
</style>
