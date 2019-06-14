<script>
import { Cropper } from 'vue-advanced-cropper'

export default {
	data() {
		return {
			img: 'https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
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
	classname="cropper"
	:src="img"
	:stencilProps="{
		aspectRatio: 10/12
	}"
  />
</div>
</template>

<style>
	.cropper {
		width: 100%;
		height: 600px;
		background: #222;
	}
</style>
