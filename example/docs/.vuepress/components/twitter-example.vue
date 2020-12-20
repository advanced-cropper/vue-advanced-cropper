<script>
import { Cropper } from 'vue-advanced-cropper';
import Navigation from './Components/Twitter/Navigation';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		ExampleWrapper,
		Cropper,
		Navigation,
	},
	data() {
		return {
			zoom: 0,
			img: require('../assets/pictures/girl-in-hat.jpg'),
		};
	},
	methods: {
		defaultSize({ imageSize }) {
			return {
				width: Math.min(imageSize.height, imageSize.width),
				height: Math.min(imageSize.height, imageSize.width),
			};
		},
		stencilSize({ boundaries }) {
			return {
				width: Math.min(boundaries.height, boundaries.width) - 48,
				height: Math.min(boundaries.height, boundaries.width) - 48,
			};
		},
		onChange(result) {
			const cropper = this.$refs.cropper;
			if (cropper) {
				if (cropper.imageSize.height < cropper.imageSize.width) {
					this.zoom =
						(cropper.imageSize.height - cropper.coordinates.height) /
						(cropper.imageSize.height - cropper.sizeRestrictions.minHeight);
				} else {
					this.zoom =
						(cropper.imageSize.width - cropper.coordinates.width) /
						(cropper.imageSize.width - cropper.sizeRestrictions.minWidth);
				}
			}
		},
		onZoom(value) {
			const cropper = this.$refs.cropper;
			if (cropper) {
				if (cropper.imageSize.height < cropper.imageSize.width) {
					const minHeight = cropper.sizeRestrictions.minHeight;
					cropper.zoom(
						((1 - this.zoom) * cropper.imageSize.height + minHeight) /
							((1 - value) * cropper.imageSize.height + minHeight),
					);
				} else {
					const minWidth = cropper.sizeRestrictions.minWidth;
					cropper.zoom(
						((1 - this.zoom) * cropper.imageSize.width + minWidth) /
							((1 - value) * cropper.imageSize.width + minWidth),
					);
				}
			}
		},
	},
};
</script>

<template>
	<example-wrapper :no-border="true" href="https://codesandbox.io/s/vue-advanced-cropper-twitter-suoyc">
		<cropper
			ref="cropper"
			class="twitter-cropper"
			background-class="twitter-cropper__background"
			foreground-class="twitter-cropper__foreground"
			image-restriction="stencil"
			default-boundaries="fill"
			:stencil-size="stencilSize"
			:transitions="false"
			:stencil-props="{
				handlers: {},
				movable: false,
				resizable: false,
				aspectRatio: 1,
				previewClass: 'twitter-cropper__stencil',
			}"
			:canvas="false"
			:debounce="false"
			:default-size="defaultSize"
			:min-width="150"
			:min-height="150"
			:src="img"
			@change="onChange"
		/>
		<navigation :zoom="zoom" @change="onZoom" />
	</example-wrapper>
</template>

<style lang="scss">
.twitter-cropper {
	height: 521px;
	&__background {
		background-color: #edf2f4;
	}
	&__foreground {
		background-color: #edf2f4;
	}
	&__stencil {
		border: solid 5px rgb(29, 161, 242);
	}
}
</style>
