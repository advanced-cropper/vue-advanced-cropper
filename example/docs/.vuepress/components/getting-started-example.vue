<script>
import { Cropper } from 'vue-advanced-cropper'

export default {
	data() {
		return {
			img: 'https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260'
		}
	},
	methods: {
		change({coordinates, canvas}) {
			console.log(
				coordinates,
				canvas,
			)
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
		@change="change"
  />
</div>
</template>

<style>
	.cropper {
		height: 600px;
		background: #222;
	}
</style>
