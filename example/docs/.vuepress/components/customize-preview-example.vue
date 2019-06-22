<script>
import { RoundStencil, Cropper } from 'vue-advanced-cropper'

export default {
	data() {
		return {
			img: 'https://images.pexels.com/photos/267968/pexels-photo-267968.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
		}
	},
	components: {
		Cropper
	}
}
</script>

<template>
<div class="customize-preview-example">
  <Cropper
	:src="img"
	stencilComponent="circle-stencil"
	:stencilProps="{
		previewClassname: 'preview'
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
