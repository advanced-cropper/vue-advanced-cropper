<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import Vue from 'vue';
import debounce from 'debounce';
import { RectangleStencil } from './components/stencils';
import { ResizeEvent, MoveEvent } from './core/events';
import { isCrossOriginURL } from './core/utils';
import { getImageTransforms, getStyleTransforms, prepareSource, parseImage } from './core/image';
import * as algorithms from './core/algorithms';

const cn = bem('vue-advanced-cropper');

export default {
	name: 'Cropper',
	props: {
		src: {
			type: String,
			default: null,
		},
		resizeAlgorithm: {
			type: Function,
			default: algorithms.resize,
		},
		moveAlgorithm: {
			type: Function,
			default: algorithms.move,
		},
		defaultSize: {
			type: Function,
			default: algorithms.defaultSize,
		},
		defaultPosition: {
			type: Function,
			default: algorithms.defaultPosition,
		},
		areaSize: {
			type: Function,
			default: algorithms.areaSize,
		},
		restrictions: {
			type: Function,
			default: algorithms.percentRestrictions,
		},
		minWidth: {
			type: [Number, String],
			default: 10,
		},
		minHeight: {
			type: [Number, String],
			default: 10,
		},
		maxWidth: {
			type: [Number, String],
		},
		maxHeight: {
			type: [Number, String],
		},
		stencilComponent: {
			type: [Object, String],
			default() {
				return RectangleStencil;
			},
		},
		stencilProps: {
			type: Object,
			default() {
				return {};
			},
		},
		classname: {
			type: String,
		},
		imageClassname: {
			type: String,
		},
		areaClassname: {
			type: String,
		},
		backgroundClassname: {
			type: String,
		},
		debounce: {
			type: Number,
			default: 500,
		},
		canvas: {
			type: Boolean,
			default: true,
		},
		checkCrossOrigin: {
			type: Boolean,
			default: true,
		},
		checkOrientation: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			boundarySize: {
				width: null,
				height: null,
			},
			imageAttributes: {
				crossOrigin: false,
				src: null,
			},
			imageTransforms: {
				rotate: null,
				scaleX: null,
				scaleY: null,
			},
			imageSize: {
				width: null,
				height: null,
			},
			coordinates: {
				left: 0,
				top: 0,
				width: 0,
				height: 0,
			},
			frozenDirections: {
				width: false,
				height: false,
			},
		};
	},
	computed: {
		imageLoaded() {
			return this.imageSize.width > 0 && this.imageSize.height > 0;
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
				stretcher: classnames(cn('stretcher')),
				background: classnames(cn('background'), this.backgroundClassname),
			};
		},
		stencilCoordinates() {
			const { width, height, left, top, } = this.coordinates;
			return {
				width: width / this.coefficient,
				height: height / this.coefficient,
				left: left / this.coefficient,
				top: top / this.coefficient,
			};
		},
		wrapperStyle() {
			return {
				width: `${this.stencilCoordinates.width}px`,
				height: `${this.stencilCoordinates.height}px`,
				left: `${this.stencilCoordinates.left}px`,
				top: `${this.stencilCoordinates.top}px`,
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
				opacity: this.imageLoaded ? 1 : 0,
			};
		},
		imageStyle() {
			const result = {
				left: '50%',
				top: '50%',
				transform: 'translate(-50%, -50%)' + getStyleTransforms(this.imageTransforms),
			};

			const flipped = this.imageTransforms.flipped;

			if (flipped) {
				result.width = this.areaStyle.height;
				result.height = this.areaStyle.width;
			} else {
				result.width = this.areaStyle.width;
				result.height = this.areaStyle.height;
			}

			if (!this.imageSize.width || !this.imageSize.height) {
				result.opacity = 0;
			}

			return result;
		},
		stencilRestrictions() {
			const restrictions = this.restrictions(
				Number(this.minWidth),
				Number(this.minHeight),
				Number(this.maxWidth),
				Number(this.maxHeight),
				this.imageSize.width,
				this.imageSize.height
			);

			if (this.minWidth > this.imageSize.width) {
				console.warn(`Warning: minimum width (${restrictions.minWidth}px) greater that the image width (${this.imageSize.width}px). It is set equal to the image width and width resizing was blocked`);
				restrictions.minWidth = this.imageSize.width;
				restrictions.widthFrozen = true;
			}
			if (this.minHeight > this.imageSize.height) {
				console.warn(`Warning: minimum height (${restrictions.minHeight}px) greater that the image height (${this.imageSize.height}px). It is set equal to the image height and height resizing was blocked`);
				restrictions.minHeight = this.imageSize.height;
				restrictions.heightFrozen = true;
			}

			if (restrictions.minWidth > restrictions.maxWidth) {
				console.warn(`Warning: maximum width (${restrictions.maxWidth}px) fewer that the minimum width (${restrictions.minWidth}px). It is set equal to the minimum width and width resizing was blocked`);
				restrictions.maxWidth = restrictions.minWidth;
				restrictions.widthFrozen = true;
			}

			if (restrictions.minHeight > restrictions.maxHeight) {
				console.warn(`Warning: maximum height (${restrictions.maxHeight}px) fewer that the minimum height (${restrictions.minHeight}px). It is set equal to the minimum height and height resizing was blocked`);
				restrictions.maxHeight = restrictions.minHeight;
				restrictions.heightFrozen = true;
			}

			if (!restrictions.maxWidth || restrictions.maxWidth > this.imageSize.width) {
				restrictions.maxWidth = this.imageSize.width;
			}
			if (!restrictions.maxHeight || restrictions.maxHeight > this.imageSize.height) {
				restrictions.maxHeight = this.imageSize.height;
			}

			return restrictions;
		},
	},
	watch: {
		src() {
			Vue.nextTick(() => {
				this.onChangeImage();
			});
		},
		minWidth() {
			this.resetCoordinates();
		},
		maxWidth() {
			this.resetCoordinates();
		},
		minHeight() {
			this.resetCoordinates();
		},
		maxHeight() {
			this.resetCoordinates();
		},
	},
	mounted() {
		this.debouncedUpdate = debounce(
			this.update,
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
	methods: {
		// External methods
		getResult() {
			if (this.canvas) {
				this.updateCanvas(this.coordinates);
				return {
					coordinates: { ...this.coordinates, },
					canvas: this.$refs.canvas,
				};
			} else {
				return {
					coordinates: { ...this.coordinates, },
				};
			}
		},
		// Internal methods
		getArea() {
			return this.$refs.area;
		},
		getStencil() {
			return this.$refs.stencil;
		},
		updateCanvas(coordinates) {
			// This function can be asynchronously called because it's debounced
			// Therefore there is workaround to prevent processing after the component was unmounted
			if (!this.$refs.canvas) return;

			const image = this.$refs.image;
			const source = this.checkOrientation ? prepareSource(this.$refs.sourceCanvas, image, this.imageTransforms) : image;

			const canvas = this.$refs.canvas;
			canvas.width = coordinates.width;
			canvas.height = coordinates.height;

			const ctx = canvas.getContext('2d');

			ctx.drawImage(
				source,
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
		update() {
			this.$emit('change', this.getResult());
		},
		onChangeCoordinates(newCoordinates) {
			this.coordinates = newCoordinates;
			if (this.$listeners && this.$listeners.change) {
				this.debouncedUpdate();
			}
		},
		onChangeImage() {
			if (this.canvas && this.checkCrossOrigin) {
				if (!/^data:/.test(this.src) && !/^blob:/.test(this.src) && isCrossOriginURL(this.src)) {
					this.imageAttributes.crossOrigin = 'anonymous';
				}
			}
			if (this.checkOrientation) {
				parseImage(this.src).then(this.onParseImage);
			} else {
				this.onParseImage();
			}
		},
		onParseImage(orientation) {
			this.imageAttributes.src = this.src;
			this.imageTransforms = getImageTransforms(orientation);
			Vue.nextTick(() => {
				const image = this.$refs.image;
				if (image) {
					if (image.complete) {
						this.refreshImage().then(this.resetCoordinates);
					} else {
						image.addEventListener('load', () => {
							// After loading image the current component can be unmounted
							// Therefore there is a workaround to prevent processing the following code
							if (this.$refs.image) {
								this.refreshImage().then(this.resetCoordinates);
							}
						});
					}
				}
			});
		},
		onResize(resizeEvent) {
			if (this.frozenDirections.width) {
				resizeEvent.directions.left = 0;
				resizeEvent.directions.right = 0;
			}
			if (this.frozenDirections.height) {
				resizeEvent.directions.top = 0;
				resizeEvent.directions.bottom = 0;
			}
			this.onChangeCoordinates(
				this.resizeAlgorithm(
					this.coordinates,
					this.stencilRestrictions,
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
			if (!this.$refs.image) return;

			const cropper = this.$refs.cropper;
			const image = this.$refs.image;
			const imageSize = this.imageSize;
			const { minWidth, minHeight, maxWidth, maxHeight, widthFrozen, heightFrozen, } = this.stencilRestrictions;
			const aspectRatio = this.stencilAspectRatios();
			const coefficient = this.coefficient;

			// Freeze height or width if there was problems while setting stencil restrictions
			this.frozenDirections.width = Boolean(widthFrozen);
			this.frozenDirections.height = Boolean(heightFrozen);

			let coordinates = {};

			if (!aspectRatio.minimum && !aspectRatio.maximum) {
				coordinates.height = maxHeight;
				coordinates.width = maxWidth;
			}
			else if (minWidth * aspectRatio.minimum < minHeight) {
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
				throw 'Error: current aspect ratio can\'t is incompatible with minimum/maximum height and width settings. Can\'t setup default coordinates';
			}

			coordinates.left = imageSize.width / 2 - coordinates.width / 2;
			coordinates.top = imageSize.height / 2 - coordinates.height / 2;

			const defaultSize = this.defaultSize(cropper, image, this.stencilRestrictions, this.$props);

			if (defaultSize.width < minWidth || defaultSize.height < minHeight || defaultSize.width > maxWidth || defaultSize.height > maxHeight) {
				console.warn('Warning: default size breaking size restrictions. Check your defaultSize function');
			}

			coordinates = this.resizeAlgorithm(
				coordinates,
				this.stencilRestrictions,
				imageSize,
				coefficient,
				aspectRatio,
				new ResizeEvent(null, {
					left: (defaultSize.width - coordinates.width) / (2 * coefficient),
					right: (defaultSize.width - coordinates.width) / (2 * coefficient),
					top: (defaultSize.height - coordinates.height) / (2 * coefficient),
					bottom: (defaultSize.height - coordinates.height) / (2 * coefficient),
				})
			);

			const defaultPosition = this.defaultPosition(
				cropper,
				image,
				coordinates.width,
				coordinates.height,
				this.imageSize.width,
				this.imageSize.height,
				this.$props
			);
			coordinates = this.moveAlgorithm(
				coordinates,
				imageSize,
				coefficient,
				new MoveEvent(null, {
					left: (defaultPosition.left - coordinates.left) / coefficient,
					top: (defaultPosition.top - coordinates.top) / coefficient,
				})
			);
			this.onChangeCoordinates(coordinates);
		},
		refreshImage() {
			const image = this.$refs.image;
			const stretcher = this.$refs.stretcher;

			if (this.imageTransforms.flipped) {
				this.imageSize.height = image.naturalWidth;
				this.imageSize.width = image.naturalHeight;
			} else {
				this.imageSize.height = image.naturalHeight;
				this.imageSize.width = image.naturalWidth;
			}

			const aspectRatio = this.imageSize.width / this.imageSize.height;

			if (this.imageSize.height > this.imageSize.width) {
				stretcher.style.height = `${this.imageSize.height}px`;
				stretcher.style.width = `${stretcher.clientHeight * aspectRatio}px`;
				if (stretcher.clientWidth / stretcher.clientHeight !== aspectRatio) {
					stretcher.style.height = `${stretcher.clientWidth / aspectRatio}px`;
				}

			} else {
				stretcher.style.width = `${this.imageSize.width}px`;
				stretcher.style.height = `${stretcher.clientWidth / aspectRatio }px`;
				if (stretcher.clientHeight / stretcher.clientWidth !== aspectRatio) {
					stretcher.style.width = `${stretcher.clientHeight * aspectRatio}px`;
				}
			}

			return new Promise(resolve => {
				const cropper = this.$refs.cropper;
				const image = this.$refs.image;

				Vue.nextTick(() => {
					const { height, width, } = this.areaSize(cropper, image, this.imageSize.width, this.imageSize.height);
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
					minimum: this.stencilProps.aspectRatio || this.stencilProps.minAspectRatio,
					maximum: this.stencilProps.aspectRatio || this.stencilProps.maxAspectRatio,
				};
			}
		},
	},
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
    />
    <div
      ref="stretcher"
      :class="classes.stretcher"
    />
    <div
      ref="area"
      :class="classes.area"
      :style="areaStyle"
    >
      <img
        ref="image"
        :crossOrigin="imageAttributes.crossOrigin"
        :src="imageAttributes.src"
        :class="classes.image"
        :style="imageStyle"
      >
      <component
        :is="stencilComponent"
        v-if="imageLoaded"
        ref="stencil"
        :img="{
          src: imageAttributes.src,
          size: imageSize,
          transforms: imageTransforms
        }"
        :result-coordinates="coordinates"
        :stencil-coordinates="stencilCoordinates"
        v-bind="stencilProps"
        @resize="onResize"
        @move="onMove"
      />
      <canvas
        v-if="canvas"
        ref="canvas"
        :style="{display:'none'}"
      />
      <canvas
        v-if="canvas"
        ref="sourceCanvas"
        :style="{display:'none'}"
      />
    </div>
  </div>
</template>

<style lang="scss">
.vue-advanced-cropper {
	text-align: center;
	position: relative;
	overflow: hidden;
	user-select: none;
	max-height: 100%;
	max-width: 100%;

	&__stretcher {
		pointer-events: none;
		position: relative;
		max-width: 100%;
		max-height: 100%;
	}

  &__image {
	opacity: 0.5;
	user-select: none;
	position: absolute;
	transform-origin: center;
	// Workaround to prevent bugs at the websites with max-width
	// rule applied to img (Vuepress for example)
	max-width: unset !important;
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
