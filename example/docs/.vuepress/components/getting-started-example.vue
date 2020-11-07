<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img:
				'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80',
		};
	},
	methods: {
		change({ coordinates, canvas }) {
			console.log(coordinates, canvas);
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
				aspectRatio: 10 / 12,
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
