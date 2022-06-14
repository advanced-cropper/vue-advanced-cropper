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
				adjustStencil: true,
				img:
					require('../assets/pictures/photo-1583853287541-6e82b3d5ea12.jpg'),
			};
		},
		methods: {
			change({ coordinates, canvas }) {
				console.log(coordinates, canvas);
			},
			pixelsRestrictions(params) {
				return params;
			}
		},
	};
</script>

<template>
	<example-wrapper class="news-adjust-stencil">
		<cropper
			ref="cropper"
			:src="img"
			:size-restrictions-algorithm="pixelsRestrictions"
			:min-height="300"
			:min-width="300"
			:max-height="600"
			:max-width="600"
			:adjust-stencil="adjustStencil"
			:default-size="{
				width: 400,
				height: 400
			}"
			:stencil-props="{
				aspectRatio: 1,
			}"
		/>
		<label class="news-adjust-stencil__adjust">
			<input type="checkbox" v-model="adjustStencil" @change="$refs.cropper.reset()"/>
			Adjust stencil
		</label>
	</example-wrapper>
</template>

<style lang="scss">
	.news-adjust-stencil {
		min-height: 200px;
		&__adjust {
			background: rgba(black, 0.7);
			padding: 10px 20px;
			position: absolute;
			left: 20px;
			top: 20px;
			color: white;
		 }
	}
</style>
