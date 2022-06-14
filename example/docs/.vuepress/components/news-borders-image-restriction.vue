

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
				imageRestriction: 'borders',
				defaultBoundaries: 'fill',
				img:
					require('../assets/pictures/photo-1583172332547-c768b4e2f5ff.jpg'),
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
	<example-wrapper class="news-borders-image-restriction">
		<cropper
			class="news-borders-image-restriction__cropper"
			ref="cropper"
			:src="img"
			:image-restriction="imageRestriction"
			:default-boundaries="defaultBoundaries"
		/>
		<div class="news-borders-image-restriction__settings">
			<select v-model="imageRestriction" @change="$refs.cropper.reset()">
				<option value="borders">Borders (new)</option>
				<option value="area">Area</option>
				<option value="stencil">Stencil</option>
				<option value="none">None</option>
			</select>
			<select v-model="defaultBoundaries" @change="$refs.cropper.reset()">
				<option value="fill">Fill</option>
				<option value="fit">Fit</option>
			</select>
		</div>
	</example-wrapper>
</template>

<style lang="scss">
	.news-borders-image-restriction {
		max-height: 600px;
		background: black;
		&__cropper {
			height: 600px;
		}
		&__settings {
			background: rgba(black, 0.7);
			padding: 10px 20px;
			position: absolute;
			left: 20px;
			top: 20px;
			color: white;
			border: solid 1px rgba(white, 0.2);
		}
	}
</style>
