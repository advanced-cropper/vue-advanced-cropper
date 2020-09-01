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
			boundaries({ cropper, imageSize }) {
				const areaHeight = cropper.clientHeight;
				const areaWidth = cropper.clientWidth;

				let currentHeight = areaHeight;
				let currentWidth = imageSize.width * areaHeight / imageSize.height;

				if (currentWidth > areaWidth) {
					currentWidth = areaWidth;
					currentHeight = imageSize.height * areaWidth / imageSize.width;
				}

				return {
					width: areaWidth,
					height: areaHeight,
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
			updateVisibleArea({ current, previous, coordinates, imageSize }) {
				if (previous.width && previous.height) {
					const visibleArea = { ...current };
					const coefficient = (imageSize.width > imageSize.height ? imageSize.height : imageSize.width) / coordinates.width;
					const width = visibleArea.width / coefficient;
					const height = visibleArea.height / coefficient;

					return {
						left: previous.left - (width - previous.width)/2,
						top: previous.top - (height - previous.height)/2,
						width,
						height
					}
				} else {
					return current;
				}
			},
			defaultVisibleArea({ imageSize, boundariesSize }) {
				const boundariesRatio = boundariesSize.width / boundariesSize.height;
				const boundariesWidth = Math.max(0, (boundariesSize.width - boundariesSize.height)) + 48;
				const desiredSize = boundariesSize.width - boundariesWidth;

				const areaProperties = {};
				if (imageSize.height > imageSize.width) {
					areaProperties.width = boundariesSize.width / desiredSize * imageSize.width;
					areaProperties.height = areaProperties.width / boundariesRatio
				} else {
					areaProperties.height = boundariesSize.height / desiredSize * imageSize.height;
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
			pixelsRestriction({minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight}) {
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
						this.zoom = (this.originalHeight - cropper.visibleArea.height) / (this.originalHeight - cropper.stencilRestrictions.minHeight)
					} else {
						this.zoom = (this.originalWidth - cropper.visibleArea.width) / (this.originalWidth - cropper.stencilRestrictions.minWidth)
					}
				}
			},
			onZoom(value) {
				const cropper = this.$refs.cropper;
				if (cropper) {
					if (this.originalHeight < this.originalWidth) {
						const minHeight = cropper.stencilRestrictions.minHeight;
						cropper.zoom(
							((1 - this.zoom) * this.originalHeight + minHeight) / ((1 - value) * this.originalHeight + minHeight)
						)
					} else {
						const minWidth = cropper.stencilRestrictions.minWidth;
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
			backgroundClassname="twitter-cropper__background"
			image-restriction="stencil"
			:stencil-props="{
				handlers: {},
				movable: false,
				scalable: false,
				aspectRatio: 1,
				previewClassname: 'twitter-cropper__stencil',
		    }"
			:debounce="false"
			:canvas="false"
			:boundaries="boundaries"
			:updateVisibleArea="updateVisibleArea"
			:defaultVisibleArea="defaultVisibleArea"
			:defaultSize="defaultSize"
			:restrictions="pixelsRestriction"
			:minWidth="150"
			:minHeight="150"
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
