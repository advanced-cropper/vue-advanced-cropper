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
			if (imageSize.width < imageSize.height) {
				return {
					width: imageSize.width,
					height: imageSize.width,
				};
			} else {
				return {
					width: imageSize.height,
					height: imageSize.height,
				};
			}
		},
		pixelsRestriction({ minWidth, minHeight, maxWidth, maxHeight }) {
			return {
				minWidth: minWidth,
				minHeight: minHeight,
				maxWidth: maxWidth,
				maxHeight: maxHeight,
			};
		},
		squareVisibleArea({ visibleArea, coordinates, imageSize, boundaries }) {
			const ratio = boundaries.width / boundaries.height;
			if (ratio < coordinates.width / coordinates.height) {
				const coefficient = coordinates.width / (boundaries.width - 48);
				const width = coordinates.width + 48 * coefficient;
				const height = width / ratio;
				return {
					width,
					height,
					left: visibleArea
						? visibleArea.left + (visibleArea.width - width) / 2
						: imageSize.width / 2 - width / 2,
					top: visibleArea
						? visibleArea.top + (visibleArea.height - height) / 2
						: imageSize.height / 2 - height / 2,
				};
			} else {
				const coefficient = coordinates.height / (boundaries.height - 48);
				const height = coordinates.height + 48 * coefficient;
				const width = height * ratio;
				return {
					width,
					height,
					left: visibleArea
						? visibleArea.left + (visibleArea.width - width) / 2
						: imageSize.width / 2 - width / 2,
					top: visibleArea
						? visibleArea.top + (visibleArea.height - height) / 2
						: imageSize.height / 2 - height / 2,
				};
			}
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
			image-restriction="stencil"
			default-boundaries="fill"
			:stencil-props="{
				handlers: {},
				movable: false,
				scalable: false,
				aspectRatio: 1,
				previewClass: 'twitter-cropper__stencil',
			}"
			:canvas="false"
			:debounce="false"
			:fit-visible-area="squareVisibleArea"
			:default-visible-area="squareVisibleArea"
			:default-size="defaultSize"
			:size-restrictions-algorithm="pixelsRestriction"
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
	&__stencil {
		border: solid 5px rgb(29, 161, 242);
	}
}
</style>
