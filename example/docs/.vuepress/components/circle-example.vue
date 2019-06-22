<script>
import { RoundStencil, Cropper } from 'vue-advanced-cropper'

export default {
	data() {
		return {
			img: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
		}
	},
	components: {
		Cropper
	}
}
</script>

<template>
<div>
  <Cropper
	:src="img"
	classname="circle-cropper"
	stencilComponent="circle-stencil"
	:stencilProps="{
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
