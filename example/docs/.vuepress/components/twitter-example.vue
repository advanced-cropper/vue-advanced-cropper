<script>
	import { Cropper } from 'vue-advanced-cropper';
	import Navigation from './Components/Twitter/Navigation';

	export default {
		components: {
			Cropper, Navigation
		},
		data() {
			return {
				zoom: 0,
				img: require('../assets/pictures/girl-in-hat.jpg'),
				originalWidth: 0,
				originalHeight: 0,
			};
		},
		methods: {
			// Full boundaries
			defaultBoundaries({ cropper, imageSize }) {
				return {
					width: cropper.clientWidth,
					height: cropper.clientHeight,
				};
			},
			// Full size
			defaultSize({ imageSize }) {
				if (imageSize.width < imageSize.height) {
					return {
						width: imageSize.width,
						height: imageSize.width
					}
				} else {
					return {
						width: imageSize.height,
						height: imageSize.height
					}
				}
			},
			fitVisibleArea({ visibleArea: previousVisibleArea, boundaries, coordinates, coefficient }) {
				const ratio = boundaries.width / boundaries.height;

				if (boundaries.width / boundaries.height < coordinates.width / coordinates.height) {
					const coefficient = coordinates.width / (boundaries.width - 48);
					const width = coordinates.width + 48 * coefficient
					const height = width / ratio
					return {
						width,
						height,
						left: previousVisibleArea.left + (previousVisibleArea.width - width) / 2,
						top: previousVisibleArea.top + (previousVisibleArea.height - height) / 2,
					}
				} else {
					const coefficient = coordinates.height / (boundaries.height - 48);
					const height = coordinates.height + 48 * coefficient;
					const width = height * ratio;
					return {
						width,
						height,
						left: previousVisibleArea.left + (previousVisibleArea.width - width) / 2,
						top: previousVisibleArea.top + (previousVisibleArea.height - height) / 2,
					}
				}
			},
			defaultVisibleArea({ imageSize, boundaries }) {
				const boundariesRatio = boundaries.width / boundaries.height;
				const boundariesWidth = Math.max(0, (boundaries.width - boundaries.height)) + 48;
				const desiredSize = boundaries.width - boundariesWidth;

				const areaProperties = {};
				if (imageSize.height > imageSize.width) {
					areaProperties.width = boundaries.width / desiredSize * imageSize.width;
					areaProperties.height = areaProperties.width / boundariesRatio
				} else {
					areaProperties.height = boundaries.height / desiredSize * imageSize.height;
					areaProperties.width = areaProperties.height * boundariesRatio
				}

				this.originalWidth = areaProperties.width;
				this.originalHeight = areaProperties.height;

				return {
					left: imageSize.width / 2 - areaProperties.width / 2,
					top: imageSize.height / 2 - areaProperties.height / 2,
					width: areaProperties.width,
					height: areaProperties.height
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
			onChange() {
				const cropper = this.$refs.cropper;
				if (cropper) {
					if (this.originalHeight < this.originalWidth) {
						this.zoom = (this.originalHeight - cropper.visibleArea.height) / (this.originalHeight - cropper.sizeRestrictions.minHeight)
					} else {
						this.zoom = (this.originalWidth - cropper.visibleArea.width) / (this.originalWidth - cropper.sizeRestrictions.minWidth)
					}
				}
			},
			onZoom(value) {
				const cropper = this.$refs.cropper;
				if (cropper) {
					if (this.originalHeight < this.originalWidth) {
						const minHeight = cropper.sizeRestrictions.minHeight;
						cropper.zoom(
							((1 - this.zoom) * this.originalHeight + minHeight) / ((1 - value) * this.originalHeight + minHeight)
						)
					} else {
						const minWidth = cropper.sizeRestrictions.minWidth;
						cropper.zoom(
							((1 - this.zoom) * this.originalWidth + minWidth) / ((1 - value) * this.originalWidth + minWidth)
						)
					}
				}
			}
		}
	};
</script>


<template>
	<div>
		<Cropper
			ref="cropper"
			class="twitter-cropper"
			background-class="twitter-cropper__background"
			image-restriction="stencil"
			:stencil-props="{
				handlers: {},
				movable: false,
				scalable: false,
				aspectRatio: 1,
				previewClass: 'twitter-cropper__stencil',
		    }"
			:debounce="false"
			:canvas="false"
			:fit-visible-area="fitVisibleArea"
			:default-visible-area="defaultVisibleArea"
			:default-size="defaultSize"
			:default-boundaries="defaultBoundaries"
			:size-restrictions-algorithm="pixelsRestriction"
			:min-width="150"
			:min-height="150"
			:src="img"
			@change="onChange"
		/>
		<Navigation :zoom="zoom" @change="onZoom"/>
	</div>
</template>

<style lang="scss">
	.twitter-cropper {
		height: 521px;
		&__background {
			background-color: #EDF2F4;
		}
		&__stencil {
			border: solid 5px rgb(29, 161, 242);
		}
	}
</style>
