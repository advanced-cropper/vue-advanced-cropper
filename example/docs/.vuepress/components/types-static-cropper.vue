<script>
	import { Cropper } from 'vue-advanced-cropper';
	import ExampleWrapper from './Components/ExampleWrapper';

	export default {
		components: {
			Cropper,
			ExampleWrapper,
		},
		props: {
			img: {
				type: String,
				default: require('../assets/pictures/girl-on-bridge.jpg')
			},
			defaultBoundaries: {
				type: String,
				default: 'fit'
			},
			imageRestriction: {
				type: String,
				default: 'fill-area'
			},
			smallHeight: {
				type: Boolean
			},
			stencilSize: {
				type: Object
			}
		},
	};
</script>

<template>
	<example-wrapper>
		<cropper
			class="types-classic-cropper"
			:class="{'types-classic-cropper--small-height': smallHeight}"
			:src="img"
			:stencil-props="{
				handlers: {},
				movable: false,
				scalable: false,
				aspectRatio: 1,
			}"
			:stencil-size="stencilSize"
			image-restriction="stencil"
			:default-boundaries="defaultBoundaries"
		/>
	</example-wrapper>
</template>

<style lang="scss">
	.types-classic-cropper {
		max-height: 500px;
		background: black;
		&--small-height {
			max-height: 300px;
		}
	}
</style>
