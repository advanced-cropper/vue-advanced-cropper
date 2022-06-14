<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';
import Results from './Components/Results';

export default {
	components: {
		Cropper,
		ExampleWrapper,
		Results,
	},
	data() {
		return {
			src:
				require('../assets/pictures/photo-1583511655857-d19b40a7a54e.jpg'),
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
		crop() {
			const { coordinates, canvas } = this.$refs.cropper.getResult();
			this.coordinates = coordinates;
			// You able to do different manipulations at a canvas
			// but there we just get a cropped image
			this.image = canvas.toDataURL();
		},
	},
};
</script>

<template>
	<example-wrapper
		class="getting-result-second-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/getting-result-second-example.vue"
	>
		<cropper
			ref="cropper"
			:src="src"
			:stencil-props="{
				aspectRatio: 1,
			}"
		/>
		<results :coordinates="coordinates" :image="image" />
		<div class="crop-button" @click="crop">Crop Image</div>
	</example-wrapper>
</template>

<style lang="scss">
@import '../styles/grid';
.getting-result-second-example {
	position: relative;

	.crop-button {
		display: flex;
		justify-content: center;
		margin-top: 10px;
		position: absolute;
		left: 50%;
		top: -10px;
		transform: translateX(-50%);
		background: rgba(black, 0.8);
		padding: 5px 20px;
		transition: background 0.5s;
		color: white;
		font-size: 16px;
		cursor: pointer;
		&:hover {
			background: rgba(#3fb37f, 0.9);
		}
	}
}
</style>
