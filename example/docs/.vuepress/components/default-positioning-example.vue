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
				'https://images.unsplash.com/photo-1527199372136-dff50c10ea34?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
		};
	},
	methods: {
		defaultPosition() {
			return {
				left: 100,
				top: 100,
			};
		},
		defaultSize() {
			return {
				width: 400,
				height: 400,
			};
		},
	},
};
</script>
<template>
	<example-wrapper
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/default-positioning-example.vue"
	>
		<cropper :src="img" :default-position="defaultPosition" :default-size="defaultSize" />
	</example-wrapper>
</template>
