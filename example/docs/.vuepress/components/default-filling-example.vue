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
				require('../assets/pictures/pexels-photo-6524107.jpeg'),
		};
	},
	methods: {
		defaultSize({ imageSize, visibleArea }) {
			return {
				width: (visibleArea || imageSize).width,
				height: (visibleArea || imageSize).height,
			};
		},
	},
};
</script>
<template>
	<example-wrapper
		href="https://github.com/advanced-cropper/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/default-filling-example.vue"
	>
		<cropper :src="img" :default-size="defaultSize" />
	</example-wrapper>
</template>
