<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';
import Results from './Components/Results';

export default {
	components: {
		Results,
		Cropper,
		ExampleWrapper,
	},
	data() {
		return {
			img:
				require('../assets/pictures/photo-1586083718719-019f9dc6ca94.jpg'),
			coordinates: {
				width: 0,
				height: 0,
				left: 0,
				top: 0,
			},
			image: null,
		};
	},
	methods: {
		onChange({ coordinates, canvas }) {
			this.coordinates = coordinates;
			this.image = canvas.toDataURL();
		},
	},
};
</script>

<template>
	<example-wrapper
		class="getting-result-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/getting-result-example.vue"
	>
		<cropper
			:src="img"
			:stencil-props="{
				aspectRatio: 1,
			}"
			@change="onChange"
		/>
		<results :coordinates="coordinates" :image="image" />
	</example-wrapper>
</template>

<style lang="scss">
@import '../styles/grid';

.getting-result-example {
	position: relative;
}
</style>
