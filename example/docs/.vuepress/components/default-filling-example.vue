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
				'https://images.pexels.com/photos/6524107/pexels-photo-6524107.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
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
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/default-filling-example.vue"
	>
		<cropper :src="img" :default-size="defaultSize" />
	</example-wrapper>
</template>
