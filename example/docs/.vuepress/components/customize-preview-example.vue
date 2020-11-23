<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		ExampleWrapper,
		Cropper,
	},
	data() {
		return {
			img: 'https://images.pexels.com/photos/1642574/pexels-photo-1642574.jpeg?h=1500&w=2520',
		};
	},
};
</script>

<template>
	<example-wrapper
		class="customize-preview-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/customize-preview-example.vue"
	>
		<cropper
			:src="img"
			stencil-component="circle-stencil"
			:stencil-props="{
				previewClass: 'preview',
			}"
		/>
	</example-wrapper>
</template>

<style lang="scss">
.customize-preview-example {
	.preview {
		border: dashed 2px rgba(255, 255, 255, 0.45);
	}
}
</style>
