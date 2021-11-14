<script>
import { Cropper } from 'vue-advanced-cropper';
import CustomBackgroundWrapper from './Components/CustomBackgroundWrapper';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		Cropper,
		ExampleWrapper,
		CustomBackgroundWrapper,
	},
	data() {
		return {
			img: 'https://images.unsplash.com/photo-1633158617942-204b1469bc05?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1024&q=80',
		};
	},
};
</script>
<template>
	<example-wrapper href="https://codesandbox.io/s/vue-advanced-cropper-custom-scroll-dmkfw">
		<cropper
			:src="img"
			:resize-image="{
				adjustStencil: false,
			}"
			:stencil-props="{
				movable: false,
				resizable: false,
				handlers: {},
				lines: {},
			}"
			:background-wrapper-component="$options.components.CustomBackgroundWrapper"
			image-restriction="stencil"
		/>
	</example-wrapper>
</template>
