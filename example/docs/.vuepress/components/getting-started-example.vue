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
				require('../assets/pictures/photo-1599140849279-1014532882fe.jpg'),
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
		/>
	</example-wrapper>
</template>

<style>
.cropper {
	height: 600px;
	background: #222;
}
</style>
