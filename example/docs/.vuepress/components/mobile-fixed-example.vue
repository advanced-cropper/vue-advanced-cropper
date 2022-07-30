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
				require('../assets/pictures/photo-1527137342181-19aab11a8ee8.jpg'),
		};
	},
};
</script>

<template>
	<example-wrapper
		class="mobile-fixed-example"
		href="https://github.com/advanced-cropper/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/mobile-fixed-example.vue"
	>
		<cropper
			:src="img"
			:stencil-size="{
				width: 300,
				height: 300,
			}"
			:stencil-props="{
				handlers: {},
				movable: false,
				resizable: false,
				aspectRatio: 1,
			}"
			image-restriction="stencil"
		/>
	</example-wrapper>
</template>
