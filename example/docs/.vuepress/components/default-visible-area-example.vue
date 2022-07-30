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
				require('../assets/pictures/photo-1602718571797-49d5e9d54563.jpg'),
		};
	},
	methods: {
		boundaries({ cropper, imageSize }) {
			return {
				width: cropper.clientWidth,
				height: cropper.clientHeight,
			};
		},
		defaultVisibleArea() {
			return {
				height: 649,
				left: 63,
				top: 668,
				width: 800,
			};
		},
	},
};
</script>

<template>
	<example-wrapper
		class="default-visible-area-example"
		href="https://github.com/advanced-cropper/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/default-visible-area-example.vue"
	>
		<cropper
			:src="img"
			:default-visible-area="defaultVisibleArea"
			default-boundaries="fill"
			priority="visible-area"
		/>
	</example-wrapper>
</template>

<style>
.default-visible-area-example {
	height: 500px;
}
</style>
