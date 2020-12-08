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
				type: String
			},
			defaultBoundaries: {
				type: String,
				default: 'fit'
			},
			defaultSize: {
				type: Object
			},
			resizeImage: {
				type: Object
			},
			defaultVisibleArea: {
				type: Object
			},
			imageRestriction: {
				type: String,
				default: 'fill-area'
			},
			smallHeight: {
				type: Boolean
			}
		},
	};
</script>

<template>
	<example-wrapper>
		<cropper
			:src="img"
			class="types-classic-cropper"
			:class="{'types-classic-cropper--small-height': smallHeight}"
			:default-boundaries="defaultBoundaries"
			:resize-image="resizeImage"
			:default-size="defaultSize"
			:default-visible-area="defaultVisibleArea"
			:image-restriction="imageRestriction"
		/>
	</example-wrapper>
</template>

<style lang="scss">
	.types-classic-cropper {
		max-height: 500px;
		background: black;
		&--small-height {
			max-height: 400px;
		}
	}
</style>
