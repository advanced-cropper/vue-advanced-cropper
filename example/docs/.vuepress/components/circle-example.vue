<script>
import { RoundStencil, Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=991&q=80',
		};
	},
};
</script>

<template>
  <div>
    <Cropper
      :src="img"
      classname="circle-cropper"
      stencil-component="circle-stencil"
      :stencil-props="{
        previewClassname: 'circle-cropper__preview'
      }"
    />
  </div>
</template>

<style lang="scss">
	.circle-cropper {
		width: 100%;
		background: #222;
		&__preview {
			border: solid 1px rgba(white, 0.15);
		}
	}
</style>
