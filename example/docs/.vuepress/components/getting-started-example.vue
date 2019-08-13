<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.unsplash.com/photo-1557097688-37778354ae11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
		};
	},
	methods: {
		change({ coordinates, canvas, }) {
			console.log(
				coordinates,
				canvas
			);
		},
	},
};
</script>

<template>
  <div>
    <Cropper
      classname="cropper"
      :src="img"
      :stencil-props="{
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
