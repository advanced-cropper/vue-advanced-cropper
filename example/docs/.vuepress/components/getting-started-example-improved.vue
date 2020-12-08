<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		Cropper,
		ExampleWrapper,
	},
	data() {
		return {
			img:
				'https://images.pexels.com/photos/3268526/pexels-photo-3268526.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=1024',
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
	<example-wrapper>
		<cropper
			class="cropper"
			:src="img"
			:stencil-props="{
				aspectRatio: 10 / 12,
			}"
			@change="change"
			image-restriction="fit-area"
			default-boundaries="fill"
			:resize-image="{
				adjustStencil: true,
			}"
		/>
	</example-wrapper>
</template>

<style>
.cropper {
	height: 600px;
	background: #222;
}
</style>
