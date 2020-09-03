<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.pexels.com/photos/872848/pexels-photo-872848.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
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
      class="cropper"
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
