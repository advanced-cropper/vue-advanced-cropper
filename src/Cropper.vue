<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import Vue from 'vue';
import debounce from 'debounce';

import { RectangleStencil } from './components/stencils';
import { ResizeEvent, MoveEvent } from './utils/events';

import * as core from './utils/core';

const cn = bem('vue-advanced-cropper');

export default {
	name: 'Cropper',
	props: {
		src: {
			type: String,
			default: null
		},
		resizeAlgorithm: {
			type: Function,
			default: core.resize
		},
		moveAlgorithm: {
			type: Function,
			default: core.move
		},
		defaultSize: {
			type: Function,
			default: core.defaultSize
		},
		defaultPosition: {
			type: Function,
			default: core.defaultPosition
		},
		areaSize: {
			type: Function,
			default: core.areaSize
		},
		minWidth: {
			type: [Number, String],
			default: 10
		},
		minHeight: {
			type: [Number, String],
			default: 10
		},
		maxWidth: {
			type: [Number, String],
			default: 100
		},
		maxHeight: {
			type: [Number, String],
			default: 100
		},
		stencilComponent: {
			type: [Object, String],
			default() {
				return RectangleStencil;
			}
		},
		stencilProps: {
			type: Object,
			default() {
				return {};
			}
		},
		classname: {
			type: String
		},
		imageClassname: {
			type: String
		},
		areaClassname: {
			type: String
		},
		backgroundClassname: {
			type: String
		},
		debounce: {
			type: Number,
			default: 500
		}
	},
	provide() {
		return {
			getArea: this.getArea
		}
	},
	data() {
		return {
			boundarySize: {
				width: null,
				height: null
			},
			imageSize: {
				width: null,
				height: null
			},
			coordinates: {
				left: 0,
				top: 0,
				width: 0,
				height: 0
			}
		};
	},
	computed: {
		imageUploaded() {
			return this.imageSize.width > 0 && this.imageSize.height > 0
		},
		coefficient() {
			return this.imageSize.width
				? this.imageSize.width / this.boundarySize.width
				: 0;
		},
		classes() {
			return {
				cropper: classnames(cn(), this.classname),
				image: classnames(cn('image'), this.imageClassname),
				area: classnames(cn('area'), this.areaClassname),
				background: classnames(cn('background'), this.backgroundClassname)
			};
		},
		stencilCoordinates() {
			const { width, height, left, top } = this.coordinates;
			return {
				width: width / this.coefficient,
				height: height / this.coefficient,
				left: left / this.coefficient,
				top: top / this.coefficient
			};
		},
		wrapperStyle() {
			return {
				width: `${this.stencilCoordinates.width}px`,
				height: `${this.stencilCoordinates.height}px`,
				left: `${this.stencilCoordinates.left}px`,
				top: `${this.stencilCoordinates.top}px`
			};
		},
		areaStyle() {
			return {
				width: this.boundarySize.width
					? `${this.boundarySize.width}px`
					: 'auto',
				height: this.boundarySize.height
					? `${this.boundarySize.height}px`
					: 'auto',
				opacity: this.imageUploaded ? 1 : 0
			};
		},
		imageStyle() {

			const result = {};

			if (this.imageSize.width >= this.boundarySize.width) {
				result.maxWidth = this.boundarySize.width ? `${this.boundarySize.width}px` : 'auto'
			} else {
				result.width = this.boundarySize.width ? `${this.boundarySize.width}px` : 'auto'
			}

			if (this.imageSize.height >= this.boundarySize.height) {
				result.maxHeight = this.boundarySize.height ? `${this.boundarySize.height}px` : 'auto'
			} else {
				result.height = this.boundarySize.height ? `${this.boundarySize.height}px` : 'auto'
			}

			if (!((result.width || result.maxWidth) && (result.height || result.maxHeight))) {
				result.opacity = 0
			}

			return result;
		},
		restrictions() {
			return {
				minHeight: this.imageSize.height * this.minHeight / 100,
				minWidth: this.imageSize.width * this.minWidth / 100,
				maxHeight: this.imageSize.height * this.maxHeight / 100,
				maxWidth: this.imageSize.width * this.maxWidth / 100
			};
		}
	},
	mounted() {
		this.debouncedUpdateCoordinates = debounce(
			this.updateCoordinates,
			this.debounce
		);
		if (this.src) {
			this.onChangeImage();
		}
		window.addEventListener('resize', this.refreshImage);
		window.addEventListener('orientationchange', this.refreshImage);
	},
	destroyed() {
		window.removeEventListener('resize', this.refreshImage);
		window.removeEventListener('orientationchange', this.refreshImage);
	},
	watch: {
		src() {
			Vue.nextTick(() => {
				this.onChangeImage();
			})
		}
	},
	methods: {
		getArea() {
			return this.$refs.area
		},
		updateCanvas(coordinates) {
			// This function can be asynchronously called because it's debounced
			// Therefore there is workaround to prevent processing after the component was unmounted
			if (!this.$refs.canvas) return

			const canvas = this.$refs.canvas;
			canvas.width = coordinates.width;
			canvas.height = coordinates.height;

			const ctx = canvas.getContext('2d');
			const image = this.$refs.image;
			ctx.drawImage(
				image,
				coordinates.left,
				coordinates.top,
				coordinates.width,
				coordinates.height,
				0,
				0,
				coordinates.width,
				coordinates.height
			);
		},
		updateCoordinates(coordinates) {
			const stencil = this.$refs.stencil;
			this.updateCanvas(coordinates);
			this.$emit('change', {
				coordinates: coordinates,
				canvas: this.$refs.canvas
			});
		},
		onChangeCoordinates(newCoordinates) {
			this.coordinates = newCoordinates;
			this.debouncedUpdateCoordinates(newCoordinates);
		},
		onChangeImage() {
			const image = this.$refs.image;
			if (image) {
				if (image.complete) {
					this.refreshImage(true).then(this.resetCoordinates);
				} else {
					image.addEventListener('load', () => {
						// After loading image the current component can be unmounted
						// Therefore there is a workaround to prevent processing the following code
						if (this.$refs.image) {
							this.refreshImage(false).then(this.resetCoordinates);
						}
					});
				}
			}
		},
		onResize(resizeEvent) {
			this.onChangeCoordinates(
				this.resizeAlgorithm(
					this.coordinates,
					this.restrictions,
					this.imageSize,
					this.coefficient,
					this.stencilAspectRatios(),
					resizeEvent
				)
			);
		},
		onMove(moveEvent) {
			this.onChangeCoordinates(
				this.moveAlgorithm(
					this.coordinates,
					this.imageSize,
					this.coefficient,
					moveEvent
				)
			);
		},
		resetCoordinates() {
			// This function can be asynchronously called after completion of refreshing image promise
			// Therefore there is a workaround to prevent processing after the component was unmounted
			if (!this.$refs.image) return

			const cropper = this.$refs.cropper;
			const image = this.$refs.image;
			const imageSize = this.imageSize;
			const { minWidth, minHeight, maxWidth, maxHeight } = this.restrictions;
			const aspectRatio = this.stencilAspectRatios();
			const coefficient = this.coefficient;

			let coordinates = {};

			if (minWidth * aspectRatio.minimum < minHeight) {
				coordinates.height = minHeight;
				coordinates.width = aspectRatio.maximum
					? minHeight * aspectRatio.maximum
					: minWidth;
			} else {
				coordinates.width = minWidth;
				coordinates.height = aspectRatio.minimum
					? minWidth * aspectRatio.minimum
					: minHeight;
			}

			if (coordinates.height < minHeight || coordinates.height > maxHeight) {
				throw 'Current aspect ratio can\'t is uncompatible with minimum/maximum height and width settings. Can\'t setup default coordinates';
			}

			coordinates.left = imageSize.width / 2 - coordinates.width / 2;
			coordinates.top = imageSize.height / 2 - coordinates.height / 2;

			const defaultSize = this.defaultSize(cropper, image, this.$props);
			coordinates = this.resizeAlgorithm(
				coordinates,
				this.restrictions,
				imageSize,
				coefficient,
				aspectRatio,
				new ResizeEvent(null, {
					left: (defaultSize.width - coordinates.width) / (2 * coefficient),
					right: (defaultSize.width - coordinates.width) / (2 * coefficient),
					top: (defaultSize.height - coordinates.height) / (2 * coefficient),
					bottom: (defaultSize.height - coordinates.height) / (2 * coefficient)
				})
			);

			const defaultPosition = this.defaultPosition(
				cropper,
				image,
				coordinates.width,
				coordinates.height,
				this.$props
			);
			coordinates = this.moveAlgorithm(
				coordinates,
				imageSize,
				coefficient,
				new MoveEvent(null, {
					left: (defaultPosition.left - coordinates.left) / coefficient,
					top: (defaultPosition.top - coordinates.top) / coefficient
				})
			);

			this.onChangeCoordinates(coordinates);
		},
		refreshImage(flag) {
			const image = this.$refs.image;
			image.style.maxHeight = 'none';
			image.style.maxWidth = 'none';

			return new Promise(resolve => {
				const cropper = this.$refs.cropper;
				const image = this.$refs.image;
				this.imageSize.height = image.naturalHeight;
				this.imageSize.width = image.naturalWidth;

				this.boundarySize.width = cropper.clientWidth;
				this.boundarySize.height = cropper.clientHeight;
				Vue.nextTick(() => {
					const { height, width } = this.areaSize(cropper, image);

					if (height) {
						this.boundarySize.height = height;
					}
					if (width) {
						this.boundarySize.width = width;
					}
					resolve();
				})

			});

		},
		stencilAspectRatios() {
			if (this.$refs.stencil.aspectRatios) {
				return this.$refs.stencil.aspectRatios();
			} else {
				return {
					minimum: this.stencilProps.aspectRatio || this.stencilProps.minAspectRatio,
					maximum: this.stencilProps.aspectRatio || this.stencilProps.maxAspectRatio
				};
			}
		}
	}
};
</script>

<template>
  <div
    ref="cropper"
    :class="classes.cropper"
  >
	<div
	  :class="classes.background"
    :style="areaStyle"
	></div>
    <img
      ref="image"
      :src="src"
      :class="classes.image"
      :style="imageStyle"
    />
    <div
      :class="classes.area"
      :style="areaStyle"
	  	ref="area"
    >
      <component
        ref="stencil"
	  		v-if="imageUploaded"
        :is="stencilComponent"
        :img="src"
        :left="coordinates.left"
        :top="coordinates.top"
        :width="coordinates.width"
        :height="coordinates.height"
        :stencil-width="stencilCoordinates.width"
        :stencil-height="stencilCoordinates.height"
        :stencil-left="stencilCoordinates.left"
        :stencil-top="stencilCoordinates.top"
        v-bind="stencilProps"
        @resize="onResize"
        @move="onMove"
      />
      <canvas
        ref="canvas"
        :style="{display:'none'}"
      />
    </div>
  </div>
</template>

<style lang="scss">
.vue-advanced-cropper {
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  user-select: none;
  max-height: 100%;
	max-width: 100%;
	flex: 1 1 auto;

  &__image {
    opacity: 0.5;
    display: inline-block;
    max-height: 100%;
    max-width: 100%;
		user-select: none;
		background: white;
  }
  &__area {
    position: absolute;
    left: 50%;
		transform: translate(-50%, -50%);
		transition: opacity 0.5s;
		top: 50%;
  }
  &__background {
		position: absolute;
		background: black;
		transition: opacity 0.5s;
		top: 50%;
    left: 50%;
		transform: translate(-50%, -50%);
  }
  &__stencil-wrapper {
    position: absolute;
  }
}
</style>
