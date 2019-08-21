<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import Vue from 'vue';
import debounce from 'debounce';
import { RectangleStencil } from './components/stencils';
import { ResizeEvent, MoveEvent } from './core/events';
import { isCrossOriginURL, addTimestamp } from './core/utils';
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
		transitionTime: {
			type: Number,
			default: 300
		}
	},
	data() {
		return {
			boundarySize: {
				width: null,
				height: null,
			},
			imageLoaded: false,
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
				transition: `opacity ${this.transitionTime}ms`
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
				result.width = `${this.boundarySize.height}px`;
				result.height = `${this.boundarySize.width}px`;
			} else {
				result.width = `${this.boundarySize.width}px`;
				result.height = `${this.boundarySize.height}px`;
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
		onChangeCoordinates(newCoordinates, debounce = true) {
			this.coordinates = newCoordinates;
			if (this.$listeners && this.$listeners.change) {
				if (debounce) {
					this.debouncedUpdate();
				} else {
					this.update();
				}
			}
		},
		onChangeImage() {
			const crossOrigin = isCrossOriginURL(this.src);
			if (crossOrigin && this.canvas && this.checkCrossOrigin) {
				this.imageAttributes.crossOrigin = 'anonymous';
			}
			this.imageLoaded = false;
			setTimeout(() => {
				if (this.checkOrientation) {
					parseImage(crossOrigin ? addTimestamp(this.src) : this.src).then(this.onParseImage);
				} else {
					this.onParseImage();
				}
			}, this.transitionTime);
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
		defaultCoordinates() {
			const aspectRatio = this.stencilAspectRatios();
			const { minWidth, minHeight, maxWidth, maxHeight } = this.stencilRestrictions;
			const imageSize = this.imageSize;

			let coordinates = {};
			if (!aspectRatio.minimum && !aspectRatio.maximum) {
				coordinates.height = minHeight;
				coordinates.width = minWidth;
			}
			else {
				let ranges = {
					width: {
						maximum: aspectRatio.minimum ? Math.min(maxHeight, minWidth / aspectRatio.minimum) : maxHeight,
						minimum: aspectRatio.maximum ? Math.max(minHeight, minWidth / aspectRatio.maximum) : minHeight,
					},
					height: {
						maximum: aspectRatio.maximum ? Math.min(maxWidth, minHeight * aspectRatio.maximum) : maxWidth,
						minimum: aspectRatio.mininum ? Math.max(minWidth, minHeight * aspectRatio.mininum) : minWidth,
					}
				};
				if (ranges.width.maximum >= ranges.width.minimum) {
					coordinates.width = minWidth;
					coordinates.height = ranges.width.minimum;
				} else if (ranges.height.maximum >= ranges.height.minimum) {
					coordinates.height = minHeight;
					coordinates.width = ranges.height.minimum;
				} else {
					throw 'Error: current aspect ratio can\'t is incompatible with minimum/maximum height and width settings. Can\'t setup default coordinates';
				}
			}

			coordinates.left = imageSize.width / 2 - coordinates.width / 2;
			coordinates.top = imageSize.height / 2 - coordinates.height / 2;

			return coordinates;
		},
		setCoordinates(transforms) {
			const imageSize = this.imageSize;
			const coefficient = this.coefficient;
			const aspectRatio = this.stencilAspectRatios();

			const moveAlgorithm = (prevCoordinates, newCoordinates) => {
				return this.moveAlgorithm(
					prevCoordinates,
					imageSize,
					coefficient,
					new MoveEvent(null, {
						left: (newCoordinates.left - prevCoordinates.left) / coefficient,
						top: (newCoordinates.top - prevCoordinates.top) / coefficient,
					})
				);
			};

			const resizeAlgorithm = (prevCoordinates, newCoordinates) => {
				let coordinates = this.defaultCoordinates();
				coordinates = this.resizeAlgorithm(
					coordinates,
					this.stencilRestrictions,
					imageSize,
					coefficient,
					aspectRatio,
					new ResizeEvent(
						null,
						{
							left: (newCoordinates.width - coordinates.width) / (2 * coefficient),
							right: (newCoordinates.width - coordinates.width) / (2 * coefficient),
							top: (newCoordinates.height - coordinates.height) / (2 * coefficient),
							bottom: (newCoordinates.height - coordinates.height) / (2 * coefficient),
						}
					)
				);
				return moveAlgorithm(coordinates, { left: prevCoordinates.left, top: prevCoordinates.top });
			};

			let coordinates = this.coordinates;

			if (!transforms.forEach) {
				transforms = [transforms];
			}

			transforms.forEach(transform => {
				let changes = {};
				if (typeof transform === 'function') {
					changes = transform({ ...coordinates }, this.imageSize);
				} else {
					changes = transform;
				}
				if (changes.width || changes.height) {
					coordinates = resizeAlgorithm(coordinates, { ...coordinates, ...changes });
				}
				if (changes.left || changes.top) {
					coordinates = moveAlgorithm(coordinates, { ...coordinates, ...changes });
				}
			});

			this.onChangeCoordinates(coordinates, false);

			return coordinates;
		},
		resetCoordinates() {
			// This function can be asynchronously called after completion of refreshing image promise
			// Therefore there is a workaround to prevent processing after the component was unmounted
			if (!this.$refs.image) return;

			const cropper = this.$refs.cropper;
			const image = this.$refs.image;
			const { minWidth, minHeight, maxWidth, maxHeight, widthFrozen, heightFrozen, } = this.stencilRestrictions;

			// Freeze height or width if there was problems while setting stencil restrictions
			this.frozenDirections.width = Boolean(widthFrozen);
			this.frozenDirections.height = Boolean(heightFrozen);

			const defaultSize = this.defaultSize(cropper, image, this.stencilRestrictions, this.$props);
			if (defaultSize.width < minWidth || defaultSize.height < minHeight || defaultSize.width > maxWidth || defaultSize.height > maxHeight) {
				console.warn('Warning: default size breaking size restrictions. Check your defaultSize function');
			}

			this.setCoordinates([
				defaultSize,
				(coordinates) => ({
					...this.defaultPosition(
						cropper,
						image,
						coordinates.width,
						coordinates.height,
						this.imageSize.width,
						this.imageSize.height,
						this.$props
					)
				})
			]);
			this.imageLoaded = true;
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
	top: 50%;
  }
  &__background {
	position: absolute;
	background: black;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
  }
  &__stencil-wrapper {
	position: absolute;
  }
}
</style>
