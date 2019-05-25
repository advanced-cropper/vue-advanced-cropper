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
		value: {
			type: Object
		},
		src: {
			type: String
		},
		disabled: {
			type: Boolean,
			default: false
		},
		canvas: {
			type: Boolean,
			default: true
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
		scaleable: {
			type: Boolean,
			default: true
		},
		scaleX: {
			type: Boolean
		},
		scaleY: {
			type: Boolean
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
		disableDefaultClasses: {
			type: Boolean,
			default: false
		},
		classname: {
			type: String
		},
		imageClassname: {
			type: String
		},
		areaClass: {
			type: String
		},
		stencilWrapperClass: {
			type: String
		},
		debounce: {
			type: Number,
			default: 500
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
				stencilWrapper: classnames(
					cn('stencil-wrapper'),
					this.stencilWrapperClassname
				)
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
					: 'auto'
			};
		},
		imageStyle() {
			return {
				maxWidth: this.boundarySize.width
					? `${this.boundarySize.width}px`
					: 'auto',
				maxHeight: this.boundarySize.height
					? `${this.boundarySize.height}px`
					: 'auto'
			};
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
		this.onChangeImage();
		this.debouncedUpdateCoordinates = debounce(
			this.updateCoordinates,
			this.debounce
		);
	},
	beforeMount() {
		window.addEventListener('resize', this.refreshImage, false);
		window.addEventListener('orientationchange', this.refreshImage, false);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.refreshImage);
		window.removeEventListener('orientationchange', this.refreshImage);
	},
	methods: {
		updateCanvas(coordinates) {
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
			if (image.complete) {
				this.refreshImage().then(this.resetCoordinates);
			} else {
				image.addEventListener('load', () => {
					this.refreshImage().then(this.resetCoordinates);
				});
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
					this.restrictions,
					this.imageSize,
					this.coefficient,
					moveEvent
				)
			);
		},
		resetCoordinates() {
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
				this.restrictions,
				imageSize,
				coefficient,
				new MoveEvent(null, {
					left: (coordinates.left - defaultPosition.left) / coefficient,
					top: (coordinates.top - defaultPosition.top) / coefficient
				})
			);

			this.onChangeCoordinates(coordinates);
		},
		refreshImage() {
			const image = this.$refs.image;
			image.style.maxHeight = 'initial';
			image.style.maxWidth = 'initial';

			return new Promise(resolve => {
				const cropper = this.$refs.cropper;

				this.imageSize.height = image.naturalHeight;
				this.imageSize.width = image.naturalWidth;

				this.boundarySize.width = cropper.clientWidth;
				this.boundarySize.height = cropper.clientHeight;

				console.log('!', this.imageSize.width, this.imageSize.height, this.boundarySize.width, this.boundarySize.height)

				Vue.nextTick(() => {
					const { height, width } = this.areaSize(cropper, image);
					if (height) {
						this.boundarySize.height = height;
					}
					if (width) {
						this.boundarySize.width = width;
					}
					resolve();
				});
			});
		},
		stencilAspectRatios() {
			if (this.$refs.stencil.aspectRatios) {
				return this.$refs.stencil.aspectRatios();
			} else {
				return {
					minimum:
            this.stencilProps.aspectRatio || this.stencilProps.minAspectRatio,
					maximum:
            this.stencilProps.aspectRatio || this.stencilProps.maxAspectRatio
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
    <img
      ref="image"
      :src="src"
      :class="classes.image"
      :style="imageStyle"
    >
    <div
      :class="classes.area"
      :style="areaStyle"
    >
      <component
        :is="stencilComponent"
        ref="stencil"
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
  -moz-user-select: none;
  &__image {
    opacity: 0.5;
    display: inline-block;
    max-height: 100%;
    max-width: 100%;
    user-select: none;
  }
  &__area {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  &__stencil-wrapper {
    position: absolute;
  }
}
</style>
