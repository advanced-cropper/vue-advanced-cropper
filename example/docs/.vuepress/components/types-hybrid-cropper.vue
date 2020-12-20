<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		Cropper,
		ExampleWrapper,
	},
	props: {
		src: {
			type: String,
		},
		defaultBoundaries: {
			type: String,
			default: 'fill',
		},
		defaultSize: {
			type: Object,
		},
		resizeImage: {
			type: Object,
		},
		defaultVisibleArea: {
			type: Object,
		},
		stencilSize: {
			type: Object,
		},
		stencilProps: {
			type: Object,
		},
		imageRestriction: {
			type: String,
			default: 'fit-area',
		},
		autoZoom: {
			type: Boolean,
		},
		smallHeight: {
			type: Boolean,
		},
		priority: {
			type: String,
		},
	},
};
</script>

<template>
	<example-wrapper>
		<cropper
			:src="src"
			class="types-hybrid-cropper"
			:priority="priority"
			:class="{ 'types-hybrid-cropper--small-height': smallHeight }"
			:default-boundaries="defaultBoundaries"
			:resize-image="resizeImage"
			:default-size="defaultSize"
			:auto-zoom="autoZoom"
			:stencil-size="stencilSize"
			:stencil-props="stencilProps"
			:default-visible-area="defaultVisibleArea"
			:image-restriction="imageRestriction"
			:autoZoom="true"
		/>
	</example-wrapper>
</template>

<style lang="scss">
.types-hybrid-cropper {
	max-height: 500px;
	background: black;
	&--small-height {
		max-height: 350px;
	}
}
</style>
