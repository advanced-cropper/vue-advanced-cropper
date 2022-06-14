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
			img: require('../assets/pictures/photo-1633158617942-204b1469bc05.jpg'),
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
