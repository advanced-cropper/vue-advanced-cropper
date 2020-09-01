<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import Vue from 'vue';
import debounce from 'debounce';
import { RectangleStencil } from './components/stencils';
import { CropperWrapper } from './components/service';
import { MoveEvent, ManipulateImageEvent } from './core/events';
import { isLocal, isCrossOriginURL, isUndefined, getSettings, parseNumber } from './core/utils';
import { arrayBufferToDataURL, getImageTransforms, getStyleTransforms, prepareSource, parseImage } from './core/image';
import { ALL_DIRECTIONS, MINIMAL_PERCENT_SIZE, IMAGE_RESTRICTIONS, DEFAULT_COORDINATES } from './core/constants';
import * as algorithms from './core/algorithms';

const cn = bem('vue-advanced-cropper');

export default {
	name: 'Cropper',
	components: {
		CropperWrapper
	},
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
		restrictions: {
			type: Function,
			default: algorithms.percentRestrictions,
		},
		initStretcher: {
			type: Function,
			default: algorithms.initStretcher
		},
		boundaries: {
			type: Function,
			default: algorithms.defaultBoundaries,
		},
		updateVisibleArea: {
			type: Function,
			default: algorithms.updateVisibleArea,
		},
		defaultVisibleArea: {
			type: Function,
			default: algorithms.defaultVisibleArea,
		},
		defaultSize: {
			type: Function,
			default: algorithms.defaultSize,
		},
		defaultPosition: {
			type: Function,
			default: algorithms.defaultPosition,
		},
		areaLimits: {
			type: Function,
			default: algorithms.areaLimits,
		},
		coordinatesLimits: {
			type: Function,
			default: algorithms.coordinatesLimits,
		},
		minWidth: {
			type: [Number, String],
		},
		minHeight: {
			type: [Number, String],
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
			type: [Boolean, Number],
			default: 500,
		},
		canvas: {
			type: Boolean,
			default: true,
		},
		checkOrientation: {
			type: Boolean,
			default: true,
		},
		checkCrossOrigin: {
			type: Boolean,
			default: true,
		},
		crossOrigin: {
			type: String,
			default: 'anonymous'
		},
		transitionTime: {
			type: Number,
			default: 300
		},
		wheelResize: {
			type: [Boolean, Object],
			default: true,
		},
		touchResize: {
			type: [Boolean, Object],
			default: true,
		},
		touchMove: {
			type: [Boolean, Object],
			default: true,
		},
		mouseMove: {
			type: [Boolean, Object],
			default: true,
		},
		imageRestriction: {
			type: String,
			default: 'area',
			validator(value) {
				return IMAGE_RESTRICTIONS.indexOf(value) !== -1;
			}
		},
		roundResult: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			imageLoaded: false,
			imageAttributes: {
				crossOrigin: false,
				src: null,
			},
			basicImageTransforms: {
				rotate: null,
				scaleX: null,
				scaleY: null,
			},
			imageSize: {
				width: null,
				height: null,
			},
			boundariesSize: {
				width: null,
				height: null,
			},
			visibleArea: {},
			coordinates: {
				...DEFAULT_COORDINATES
			},
			stencilCoordinates: {
				...DEFAULT_COORDINATES
			},
			frozenDirections: {
				width: false,
				height: false,
			}
		};
	},
	computed: {
		settings() {
			return {
				resize: getSettings(this.resize, {
					stencil: false
				}),
				touchResize: getSettings(this.touchResize),
				touchMove: getSettings(this.touchMove),
				mouseMove: getSettings(this.mouseMove),
				wheelResize: getSettings(this.wheelResize, {
					ratio: 0.1
				}),
			};
		},
		imageTransforms() {
			return {
				...this.basicImageTransforms,
				scaleX: (this.basicImageTransforms.scaleX || 1),
				scaleY: (this.basicImageTransforms.scaleY || 1),
				translateX: (this.visibleArea.left) / this.coefficient,
				translateY: (this.visibleArea.top) / this.coefficient,
			};
		},
		coefficient() {
			return this.visibleArea.width ? this.visibleArea.width / this.boundariesSize.width : 0;
		},
		classes() {
			return {
				cropper: classnames(cn(), this.classname),
				image: classnames(cn('image'), this.imageClassname),
				area: classnames(cn('area'), this.areaClassname),
				stretcher: classnames(cn('stretcher')),
				background: classnames(cn('background'), this.backgroundClassname),
				imageWrapper: classnames(cn('image-wrapper')),
				cropperWrapper: classnames(cn('cropper-wrapper')),
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
				width: this.boundariesSize.width
					? `${this.boundariesSize.width}px`
					: 'auto',
				height: this.boundariesSize.height
					? `${this.boundariesSize.height}px`
					: 'auto',
				opacity: this.imageLoaded ? 1 : 0,
				transition: `opacity ${this.transitionTime}ms`,
				pointerEvents: this.imageLoaded ? 'all' : 'none',
			};
		},
		imageStyle() {
			const result = {
				left: `${-this.imageTransforms.translateX}px`,
				top: `${-this.imageTransforms.translateY}px`,
				transform: getStyleTransforms(this.imageTransforms),
			};

			const { flipped } = this.imageTransforms;
			if (flipped) {
				result.width = `${this.imageSize.height / this.coefficient}px`;
				result.height = `${this.imageSize.width / this.coefficient}px`;
			} else {
				result.width = `${this.imageSize.width / this.coefficient}px`;
				result.height = `${this.imageSize.height / this.coefficient}px`;
			}
			return result;
		},
		stencilRestrictions() {
			const minSize = Math.max(
				MINIMAL_PERCENT_SIZE * this.imageSize.width / this.coefficient,
				MINIMAL_PERCENT_SIZE * this.imageSize.height / this.coefficient,
			);

			const oldRestrictions = {
				minWidth: !isUndefined(this.minWidth) ? this.minWidth : 0,
				minHeight: !isUndefined(this.minHeight) ? this.minHeight : 0,
				maxWidth: !isUndefined(this.maxWidth) ? this.maxWidth : Infinity,
				maxHeight: !isUndefined(this.maxHeight) ? this.maxHeight : Infinity,
			};

			const restrictions = this.restrictions({
				minWidth: parseNumber(oldRestrictions.minWidth),
				minHeight: parseNumber(oldRestrictions.minHeight),
				maxWidth: parseNumber(oldRestrictions.maxWidth),
				maxHeight: parseNumber(oldRestrictions.maxHeight),
				imageWidth: this.imageSize.width,
				imageHeight: this.imageSize.height,
				props: this.$props
			});

			const coordinatesLimits = this.getCoordinatesLimits(false);

			if ('left' in coordinatesLimits && 'right' in coordinatesLimits) {
				restrictions.maxWidth = Math.min(restrictions.maxWidth, coordinatesLimits.right - coordinatesLimits.left);
			}
			if ('top' in coordinatesLimits && 'bottom' in coordinatesLimits) {
				restrictions.maxHeight = Math.min(restrictions.maxHeight, coordinatesLimits.bottom - coordinatesLimits.top);
			}

			if (isUndefined(restrictions.minWidth)) {
				restrictions.minWidth = Math.floor(minSize);
			}

			if (isUndefined(restrictions.minHeight)) {
				restrictions.minHeight = Math.floor(minSize);
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



			if (this.imageRestriction !== 'none') {
				const visibleAreaMaximum = algorithms.fitIn(this.visibleArea, this.imageSize);

				let maxWidth = this.imageRestriction === 'area' ? visibleAreaMaximum.width : this.imageSize.width;
				let maxHeight = this.imageRestriction === 'area' ? visibleAreaMaximum.height : this.imageSize.height;
				if (!restrictions.maxWidth || (restrictions.maxWidth > maxWidth)) {
					restrictions.maxWidth = maxWidth;
				}
				if (!restrictions.maxHeight || (restrictions.maxHeight > maxHeight)) {
					restrictions.maxHeight = maxHeight;
				}
			}

			// Stencil should not be smaller than visible area anyway
			restrictions.minWidth = Math.min(restrictions.minWidth, this.visibleArea.width);
			restrictions.minHeight = Math.min(restrictions.minHeight, this.visibleArea.height);

			// The magic number is the approximation of the handler size
			// Temporary solution that should be improved in the future
			restrictions.minimum = Math.min(
				this.coordinates.width, this.coordinates.height, 20 * this.coefficient
			);

			return restrictions;
		},
	},
	watch: {
		src() {
			this.onChangeImage();
		},
		minWidth() {
			this.onPropsChange();
		},
		maxWidth() {
			this.onPropsChange();
		},
		minHeight() {
			this.onPropsChange();
		},
		maxHeight() {
			this.onPropsChange();
		},
		imageRestriction() {
			this.resetCoordinates();
		},
		stencilProps(oldProps, newProps) {
			const significantProps = ['aspectRatio', 'minAspectRatio', 'maxAspectRatio'];
			if (significantProps.find(prop => oldProps[prop] !== newProps[prop])) {
				Vue.nextTick(this.onPropsChange);
			}
		}
	},
	mounted() {
		this.debouncedUpdate = debounce(
			this.update,
			this.debounce
		);

		this.$refs.image.addEventListener('load', () => {
			this.onSuccessLoadImage();
		});
		this.$refs.image.addEventListener('error', () => {
			this.onFailLoadImage();
		});
		this.onChangeImage();

		// Add listeners to window to adapt the cropper to window changes
		window.addEventListener('resize', this.onResizeContainer);
		window.addEventListener('orientationchange', this.onResizeContainer);
	},
	destroyed() {
		window.removeEventListener('resize', this.refreshImage);
		window.removeEventListener('orientationchange', this.refreshImage);
	},
	methods: {
		// External methods
		getResult() {
			const coordinates = this.prepareResult({ ...this.coordinates });
			if (this.canvas && this.src && this.imageLoaded) {
				this.updateCanvas(this.coordinates);
				return {
					coordinates,
					canvas: this.$refs.canvas,
				};
			} else {
				return {
					coordinates,
				};
			}
		},
		zoom(factor, center) {
			this.onManipulateImage(
				new ManipulateImageEvent(null, {}, {
					factor: 1 / factor,
					center
				})
			);
		},
		move(left, top) {
			this.onManipulateImage(
				new ManipulateImageEvent(null, {
					left: left || 0,
					top: top || 0
				})
			);
		},
		// Internal methods
		prepareResult(coordinates) {
			if (this.roundResult) {
				return algorithms.roundCoordinates({
					coordinates,
					restrictions: this.restrictions,
					limits: this.getCoordinatesLimits(),
				});
			} else {
				return coordinates;
			}
		},
		getArea() {
			return this.$refs.area;
		},
		getStencil() {
			return this.$refs.stencil;
		},
		autoZoom(coordinates) {
			const { visibleArea } = algorithms.autoZoom({
				coordinates,
				visibleArea: this.visibleArea,
				limits: this.getAreaLimits(),
			});

			this.visibleArea = visibleArea;
			this.updateStencilCoordinates(coordinates);
		},
		updateStencilCoordinates(coordinates) {
			const { width, height, left, top, } = coordinates;
			this.stencilCoordinates =  {
				width: width / this.coefficient,
				height: height / this.coefficient,
				left: (left - this.visibleArea.left) / this.coefficient,
				top: (top - this.visibleArea.top) / this.coefficient,
			};
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
			ctx.clearRect(0,0,canvas.width,canvas.height);
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
		onResizeContainer() {
			const image = this.$refs.image;
			if (this.src && image) {
				this.refreshImage().then(() => {
					this.updateStencilCoordinates(this.coordinates);
				});
			}
		},
		onChangeCoordinates(newCoordinates, debounce = true) {
			this.coordinates = newCoordinates;
			if (this.$listeners && this.$listeners.change) {
				if (debounce && this.debounce) {
					this.debouncedUpdate();
				} else {
					this.update();
				}
			}
		},
		onChangeImage() {
			this.imageLoaded = false;
			this.delayedTransforms = null;
			this.imageAttributes.src = null;

			if (this.src) {
				const crossOrigin = isCrossOriginURL(this.src);
				if (crossOrigin && this.canvas && this.checkCrossOrigin) {
					this.imageAttributes.crossOrigin = this.crossOrigin;
				}
				setTimeout(() => {
					const src = this.src;
					if (this.checkOrientation) {
						parseImage(src).then(this.onParseImage);
					} else {
						this.onParseImage({
							source: src
						});
					}
				}, this.transitionTime);
			} else {
				this.clearImage();
			}
		},
		onFailLoadImage() {
			this.clearImage();
			this.$emit('error');
		},
		onSuccessLoadImage() {
			// After loading image the current component can be unmounted
			// Therefore there is a workaround to prevent processing the following code
			if (this.$refs.image && !this.imageLoaded) {
				this.imageLoaded = true;
				this.refreshImage().then(() => {
					this.resetCoordinates();
					this.$emit('ready');
				});
			}
		},
		onParseImage({ source, arrayBuffer, orientation }) {
			if (arrayBuffer && orientation && isLocal(source)) {
				this.imageAttributes.src = arrayBufferToDataURL(arrayBuffer);
			} else {
				this.imageAttributes.src = source;
			}
			this.basicImageTransforms = getImageTransforms(orientation);
			Vue.nextTick(() => {
				const image = this.$refs.image;
				if (image && image.complete) {
					if (image.naturalWidth) {
						this.onSuccessLoadImage();
					} else {
						this.onFailLoadImage();
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
			ALL_DIRECTIONS.forEach(direction => {
				resizeEvent.directions[direction] *= this.coefficient;
			});
			this.onChangeCoordinates(
				this.resizeAlgorithm({
					coordinates: this.coordinates,
					limits: this.getCoordinatesLimits(),
					restrictions: this.stencilRestrictions,
					aspectRatio: this.stencilRatio(),
					resizeEvent
				})
			);
			this.updateStencilCoordinates(this.coordinates);
		},
		onManipulateImage(event) {
			if (event.move.left) {
				event.move.left *= this.coefficient;
			}
			if (event.move.top) {
				event.move.top *= this.coefficient;
			}
			// Get the absolute coordinates of scale center instead coordinates relative to visibleArea
			if (event.scale.center) {
				event.scale.center.left = event.scale.center.left * this.coefficient + this.visibleArea.left;
				event.scale.center.top = event.scale.center.top * this.coefficient + this.visibleArea.top;
			}
			const { visibleArea, coordinates } = algorithms.manipulateImage({
				event,
				coordinates: this.coordinates,
				visibleArea: this.visibleArea,
				areaLimits: this.getAreaLimits(),
				coordinatesLimits: this.getCoordinatesLimits(false),
				restrictions: this.stencilRestrictions,
				settings: {
					frozenDirections: this.frozenDirections,
					imageRestriction: this.imageRestriction,
					resizeStencil: this.settings.resize.stencil,
				}
			});

			this.visibleArea = visibleArea;
			this.onChangeCoordinates(coordinates);
			this.updateStencilCoordinates(coordinates);
		},
		onMove(moveEvent) {
			ALL_DIRECTIONS.forEach(direction => {
				moveEvent.directions[direction] *= this.coefficient;
			});
			this.onChangeCoordinates(
				this.moveAlgorithm({
					moveEvent,
					coordinates: this.coordinates,
					limits: this.getCoordinatesLimits(),
				})
			);
			this.updateStencilCoordinates(this.coordinates);
		},
		setCoordinates(transforms, params = {}) {
			const { autoZoom = true } = params;
			Vue.nextTick(() => {
				if (!this.imageLoaded) {
					this.delayedTransforms = transforms;
				} else {
					this.applyTransforms(transforms, autoZoom);
				}
			});
		},
		onPropsChange() {
			this.applyTransforms(this.coordinates, true);
		},
		applyTransforms(transforms, autoZoom = false) {
			const limits = this.getCoordinatesLimits(false);

			const moveAlgorithm = (prevCoordinates, newCoordinates) => {
				return this.moveAlgorithm({
					coordinates: prevCoordinates,
					limits,
					moveEvent: new MoveEvent(null, {
						left: (newCoordinates.left - prevCoordinates.left),
						top: (newCoordinates.top - prevCoordinates.top),
					})
				});
			};

			const resizeAlgorithm = (prevCoordinates, newCoordinates) => {
				let coordinates = {
					...prevCoordinates,
					...algorithms.approximatedSize({
						width: newCoordinates.width,
						height: newCoordinates.height,
						restrictions: this.stencilRestrictions,
						aspectRatio: this.stencilRatio(),
					}),
					left: 0,
					top: 0,
				};

				return moveAlgorithm(coordinates, {
					left: prevCoordinates.left,
					top: prevCoordinates.top
				});
			};

			let coordinates = this.coordinates;

			if (!Array.isArray(transforms)) {
				transforms = [transforms];
			}

			transforms.forEach(transform => {
				let changes = {};
				if (typeof transform === 'function') {
					changes = transform({ ...coordinates }, this.imageSize);
				} else {
					changes = transform;
				}

				if (!isUndefined(changes.width) || !isUndefined(changes.height)) {
					coordinates = resizeAlgorithm(coordinates, { ...coordinates, ...changes });
				}
				if (!isUndefined(changes.left) || !isUndefined(changes.top)) {
					coordinates = moveAlgorithm(coordinates, { ...coordinates, ...changes });
				}
			});

			if (autoZoom) {
				this.autoZoom(coordinates);
			} else {
				this.updateStencilCoordinates(coordinates);
			}
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

			const defaultSize = this.defaultSize({
				imageSize: this.imageSize,
				aspectRatio: this.stencilRatio(),
				restrictions: this.stencilRestrictions,
				visibleArea: this.visibleArea,
				// Maybe this parameters will be removed in the release version
				cropper,
				image,
				imageWidth: this.imageSize.width,
				imageHeight: this.imageSize.height,
				props: this.$props,
				...this.stencilRestrictions,
			});

			if (process.env.NODE_ENV === 'development' && defaultSize.width < minWidth || defaultSize.height < minHeight || defaultSize.width > maxWidth || defaultSize.height > maxHeight) {
				console.warn('Warning: the default size breaks size restrictions. Check your defaultSize function', defaultSize, this.stencilRestrictions);
			}

			const transforms = [
				defaultSize,
				(coordinates) => ({
					...this.defaultPosition({
						visibleArea: this.visibleArea,
						cropper,
						image,
						stencilWidth: coordinates.width,
						stencilHeight: coordinates.height,
						imageWidth: this.imageSize.width,
						imageHeight: this.imageSize.height,
						props: this.$props
					})
				})
			];

			if (this.delayedTransforms) {
				transforms.push(...Array.isArray(this.delayedTransforms) ? this.delayedTransforms : [this.delayedTransforms]);
			}
			this.applyTransforms(transforms);
			this.delayedTransforms = null;
		},
		clearImage() {
			const stretcher = this.$refs.stretcher;
			this.imageLoaded = false;
			setTimeout(() => {
				stretcher.style.height = 'auto';
				stretcher.style.width = 'auto';
				this.coordinates = { ...DEFAULT_COORDINATES };
				this.boundariesSize = {
					width: 0,
					height: 0,
				};
				this.updateStencilCoordinates({ ...DEFAULT_COORDINATES });
			}, this.transitionTime);
		},
		getAreaLimits() {
			return this.areaLimits({
				imageSize: this.imageSize,
				visibleArea: this.visibleArea,
				imageRestriction: this.imageRestriction
			});
		},
		getCoordinatesLimits(insideArea = true) {
			const limits =
				this.coordinatesLimits({
					imageSize: this.imageSize,
					imageRestriction: this.imageRestriction
				});
			return insideArea ? algorithms.limitBy(limits, algorithms.toLimits(this.visibleArea)) : limits;
		},
		refreshImage() {
			return new Promise((resolve, reject) => {
				const image = this.$refs.image;
				const cropper = this.$refs.cropper;
				if (this.src && image) {
					// 1. First of all, we should stretch cropper
					const stretcher = this.$refs.stretcher;
					if (this.imageTransforms.flipped) {
						this.imageSize.height = image.naturalWidth;
						this.imageSize.width = image.naturalHeight;
					} else {
						this.imageSize.height = image.naturalHeight;
						this.imageSize.width = image.naturalWidth;
					}

					this.initStretcher({
						cropper,
						stretcher,
						imageSize: this.imageSize
					});

					// 2. The code below should be executed after rerender (i.e. stretching of cropper)
					Vue.nextTick(() => {
						this.boundariesSize = this.boundaries({ cropper, imageSize: this.imageSize });

						const newArea = this.defaultVisibleArea({
							imageSize: this.imageSize,
							boundariesSize: this.boundariesSize
						});

						const boundariesRatio = this.boundariesSize.width / this.boundariesSize.height;

						if (newArea.width / newArea.height !== boundariesRatio) {
							newArea.height = newArea.width / boundariesRatio;
						}

						const visibleArea = this.updateVisibleArea({
							current: newArea,
							previous: this.visibleArea,
							limits: this.getAreaLimits(),
							coordinates: this.coordinates,
							boundariesSize: this.boundariesSize,
							imageSize: this.imageSize,
						});

						// If visible area was changed the coordinates should be adapted to this changes
						const coordinates = algorithms.fitToVisibleArea({
							visibleArea,
							coordinates: this.coordinates,
							stencilRatio: this.stencilRatio(),
							stencilRestrictions: this.stencilRestrictions,
							coordinatesLimits: this.coordinatesLimits({
								visibleArea,
								imageRestriction: this.imageRestriction,
								imageSize: this.imageSize
							}),
						});

						this.visibleArea = visibleArea;
						this.coordinates = coordinates;
						resolve();
					});
				} else {
					reject();
				}
			});
		},
		getAllowedArea(breakBoundaries) {
			return algorithms.areaLimits({
				breakBoundaries,
				imageSize: this.imageSize,
				visibleArea: this.visibleArea,
				imageRestriction: this.imageRestriction
			});
		},
		stencilRatio() {
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
      <cropper-wrapper
        :class="classes.cropperWrapper"
        :wheel-resize="settings.wheelResize"
        :touch-resize="settings.touchResize"
        :touch-move="settings.touchMove"
        :mouse-move="settings.touchMove"
        @move="onManipulateImage"
        @resize="onManipulateImage"
      >
        <div :class="classes.imageWrapper">
          <img
            ref="image"
            :cross-origin="imageAttributes.crossOrigin"
            :src="imageAttributes.src"
            :class="classes.image"
            :style="imageStyle"
            @mousedown.prevent
          >
        </div>
        <component
          :is="stencilComponent"
          ref="stencil"
          :img="{
            src: imageAttributes.src,
            size: imageSize,
            transforms: imageTransforms,
            coefficient: coefficient
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
      </cropper-wrapper>
    </div>
  </div>
</template>

<style lang="scss">
.vue-advanced-cropper {
	text-align: center;
	position: relative;
	user-select: none;
	max-height: 100%;
	max-width: 100%;
	direction: ltr;

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
  &__cropper-wrapper {
	width: 100%;
	height: 100%;
  }
  &__image-wrapper {
	overflow: hidden;
	position: absolute;
	width: 100%;
	height: 100%;
  }
  &__stencil-wrapper {
	position: absolute;
  }
}
</style>
