<script>
import { Cropper } from 'vue-advanced-cropper';
import Navigation from './Components/Twitter/Navigation';

export default {
	components: {
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
		fitVisibleArea({ visibleArea: previousVisibleArea, boundaries, coordinates, coefficient }) {
			const ratio = boundaries.width / boundaries.height;

			if (boundaries.width / boundaries.height < coordinates.width / coordinates.height) {
				const coefficient = coordinates.width / (boundaries.width - 48);
				const width = coordinates.width + 48 * coefficient;
				const height = width / ratio;
				return {
					width,
					height,
					left: previousVisibleArea.left + (previousVisibleArea.width - width) / 2,
					top: previousVisibleArea.top + (previousVisibleArea.height - height) / 2,
				};
			} else {
				const coefficient = coordinates.height / (boundaries.height - 48);
				const height = coordinates.height + 48 * coefficient;
				const width = height * ratio;
				return {
					width,
					height,
					left: previousVisibleArea.left + (previousVisibleArea.width - width) / 2,
					top: previousVisibleArea.top + (previousVisibleArea.height - height) / 2,
				};
			}
		},
		defaultVisibleArea({ imageSize, boundaries }) {
			const boundariesRatio = boundaries.width / boundaries.height;
			const boundariesWidth = Math.max(0, boundaries.width - boundaries.height) + 48;
			const desiredSize = boundaries.width - boundariesWidth;

			const areaProperties = {};
			if (imageSize.height > imageSize.width) {
				areaProperties.width = (boundaries.width / desiredSize) * imageSize.width;
				areaProperties.height = areaProperties.width / boundariesRatio;
			} else {
				areaProperties.height = (boundaries.height / desiredSize) * imageSize.height;
				areaProperties.width = areaProperties.height * boundariesRatio;
			}

			return {
				left: imageSize.width / 2 - areaProperties.width / 2,
				top: imageSize.height / 2 - areaProperties.height / 2,
				width: areaProperties.width,
				height: areaProperties.height,
			};
		},
		pixelsRestriction({ minWidth, minHeight, maxWidth, maxHeight }) {
			return {
				minWidth: minWidth,
				minHeight: minHeight,
				maxWidth: maxWidth,
				maxHeight: maxHeight,
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
	<div>
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
			:fit-visible-area="fitVisibleArea"
			:default-visible-area="defaultVisibleArea"
			:default-size="defaultSize"
			:size-restrictions-algorithm="pixelsRestriction"
			:min-width="150"
			:min-height="150"
			:src="img"
			@change="onChange"
		/>
		<Navigation :zoom="zoom" @change="onZoom" />
	</div>
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
