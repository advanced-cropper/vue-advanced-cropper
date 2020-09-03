<script>
import { RoundStencil, Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.pexels.com/photos/1642574/pexels-photo-1642574.jpeg?h=1500&w=2520',
		};
	},
};
</script>

<template>
  <div class="customize-preview-example">
    <Cropper
      :src="img"
      stencil-component="circle-stencil"
      :stencil-props="{
        previewClass: 'preview'
      }"
    />
  </div>
</template>

<style lang="scss">
.customize-preview-example {
	.preview {
		border: dashed 2px rgba(255, 255, 255, 0.45);
	}
}
</style>
