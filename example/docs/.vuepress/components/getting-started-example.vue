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
				'https://images.unsplash.com/photo-1599140849279-1014532882fe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80',
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
