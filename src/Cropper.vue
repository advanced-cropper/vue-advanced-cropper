<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import Vue from 'vue';
import debounce from 'debounce';
import { RectangleStencil } from './components/stencils';
import { CropperWrapper } from './components/service';
import { replacedProp } from './core';
import { MoveEvent, ManipulateImageEvent } from './core/events';
import { isLocal, isCrossOriginURL, isUndefined, getSettings, parseNumber } from './core/utils';
import { arrayBufferToDataURL, getImageTransforms, getStyleTransforms, prepareSource, parseImage } from './core/image';
import { ALL_DIRECTIONS, IMAGE_RESTRICTIONS, DEFAULT_COORDINATES } from './core/constants';
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
		imageClass: {
			type: String,
		},
		areaClass: {
			type: String,
		},
		backgroundClass: {
			type: String,
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
		},
		resizeAlgorithm: {
			type: Function,
			default: algorithms.resize,
		},
		moveAlgorithm: {
			type: Function,
			default: algorithms.move,
		},
		initStretcher: {
			type: Function,
			default: algorithms.initStretcher
		},
		fitCoordinates: {
			type: Function,
			default: algorithms.fitToVisibleArea,
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
		defaultBoundaries: {
			type: Function,
			default: algorithms.defaultBoundaries,
		},
		areaRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.areaRestrictions,
		},
		sizeRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.percentRestrictions,
		},
		positionRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.positionRestrictions,
		},
		// Deprecated props
		restrictions: {
			type: Function,
			validator(value) {
				return replacedProp(value, 'restrictions', 'sizeRestrictionsAlgorithm');
			}
		},
		classname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'classname', 'class');
			}
		},
		imageClassname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'imageClassname', 'imageClass');
			}
		},
		areaClassname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'areaClassname', 'areaClass');
			}
		},
		backgroundClassname: {
			type: String,
			validator(value) {
				return  replacedProp(value, 'backgroundClassname', 'backgroundClass');
			}
		},
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
			boundaries: {
				width: null,
				height: null,
			},
			visibleArea: {},
			coordinates: {
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
		coefficient() {
			return this.visibleArea.width ? this.visibleArea.width / this.boundaries.width : 0;
		},
		areaRestrictions() {
			return this.areaRestrictionsAlgorithm({
				imageSize: this.imageSize,
				visibleArea: this.visibleArea,
				imageRestriction: this.imageRestriction
			});
		},
		areaStyle() {
			return {
				width: this.boundaries.width
					? `${this.boundaries.width}px`
					: 'auto',
				height: this.boundaries.height
					? `${this.boundaries.height}px`
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
		sizeRestrictions() {
			const oldRestrictions = {
				minWidth: !isUndefined(this.minWidth) ? this.minWidth : 0,
				minHeight: !isUndefined(this.minHeight) ? this.minHeight : 0,
				maxWidth: !isUndefined(this.maxWidth) ? this.maxWidth : Infinity,
				maxHeight: !isUndefined(this.maxHeight) ? this.maxHeight : Infinity,
			};

			const restrictions = (this.restrictions || this.sizeRestrictionsAlgorithm)({
				imageSize: this.imageSize,
				minWidth: parseNumber(oldRestrictions.minWidth),
				minHeight: parseNumber(oldRestrictions.minHeight),
				maxWidth: parseNumber(oldRestrictions.maxWidth),
				maxHeight: parseNumber(oldRestrictions.maxHeight),
				imageWidth: this.imageSize.width,
				imageHeight: this.imageSize.height,
				props: this.$props
			});

			const positionRestrictions = this.positionRestrictions;

			if ('left' in positionRestrictions && 'right' in positionRestrictions) {
				restrictions.maxWidth = Math.min(restrictions.maxWidth, positionRestrictions.right - positionRestrictions.left);
			}
			if ('top' in positionRestrictions && 'bottom' in positionRestrictions) {
				restrictions.maxHeight = Math.min(restrictions.maxHeight, positionRestrictions.bottom - positionRestrictions.top);
			}

			if (restrictions.minWidth > restrictions.maxWidth) {
				if (process.env.NODE_ENV !== 'production') {
					console.warn(`Warning: maximum width (${restrictions.maxWidth}px) fewer that the minimum width (${restrictions.minWidth}px). It is set equal to the minimum width and width resizing was blocked`);
				}
				restrictions.maxWidth = restrictions.minWidth;
				restrictions.widthFrozen = true;
			}

			if (restrictions.minHeight > restrictions.maxHeight) {
				if (process.env.NODE_ENV !== 'production') {
					console.warn(`Warning: maximum height (${restrictions.maxHeight}px) fewer that the minimum height (${restrictions.minHeight}px). It is set equal to the minimum height and height resizing was blocked`);
				}
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

			// Stencil should not be larger than visible area anyway
			restrictions.minWidth = Math.min(restrictions.minWidth, this.visibleArea.width);
			restrictions.minHeight = Math.min(restrictions.minHeight, this.visibleArea.height);

			// The magic number is the approximation of the handler size
			// Temporary solution that should be improved in the future
			restrictions.minimum = Math.min(
				this.coordinates.width, this.coordinates.height, 20 * this.coefficient
			);

			return restrictions;
		},
		positionRestrictions() {
			return this.positionRestrictionsAlgorithm({
				imageSize: this.imageSize,
				imageRestriction: this.imageRestriction
			});
		},
		// Styling
		classes() {
			return {
				cropper: classnames(cn(), this.classname),
				image: classnames(cn('image'), this.imageClass || this.imageClassname),
				area: classnames(cn('area'), this.areaClass || this.areaClassname),
				stretcher: classnames(cn('stretcher')),
				background: classnames(cn('background'), this.backgroundClass || this.backgroundClassname),
				imageWrapper: classnames(cn('image-wrapper')),
				cropperWrapper: classnames(cn('cropper-wrapper')),
			};
		},
		imageTransforms() {
			return {
				...this.basicImageTransforms,
				scaleX: this.basicImageTransforms.scaleX || 1,
				scaleY: this.basicImageTransforms.scaleY || 1,
				translateX: this.visibleArea.left / this.coefficient,
				translateY: this.visibleArea.top / this.coefficient,
			};
		},
		stencilCoordinates() {
			const { width, height, left, top, } = this.coordinates;
			return {
				width: width / this.coefficient,
				height: height / this.coefficient,
				left: (left - this.visibleArea.left) / this.coefficient,
				top: (top - this.visibleArea.top) / this.coefficient,
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
		window.addEventListener('resize', this.refresh);
		window.addEventListener('orientationchange', this.refresh);
	},
	destroyed() {
		window.removeEventListener('resize', this.refresh);
		window.removeEventListener('orientationchange', this.refresh);
	},
	methods: {
		// External methods
		getResult() {
			const coordinates = this.prepareResult({ ...this.coordinates });
			if (this.canvas && this.src && this.imageLoaded) {
				this.updateCanvas(this.coordinates);
				return {
					coordinates,
					visibleArea: { ...this.visibleArea },
					canvas: this.$refs.canvas,
				};
			} else {
				return {
					coordinates,
					visibleArea: { ...this.visibleArea },
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
		// Internal methods
		prepareResult(coordinates) {
			if (this.roundResult) {
				return algorithms.roundCoordinates({
					coordinates,
					sizeRestrictions: this.sizeRestrictions,
					positionRestrictions: this.getPositionRestrictions(),
				});
			} else {
				return coordinates;
			}
		},
		autoZoom(coordinates) {
			const { visibleArea } = algorithms.autoZoom({
				coordinates,
				visibleArea: this.visibleArea,
				areaRestrictions: this.areaRestrictions,
			});

			this.visibleArea = visibleArea;
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
				if (crossOrigin && this.canvas) {
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
				this.visibleArea = {};
				this.refresh().then(() => {
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
					positionRestrictions: this.getPositionRestrictions(),
					sizeRestrictions: this.sizeRestrictions,
					aspectRatio: this.getAspectRatio(),
					resizeEvent
				})
			);
		},
		onManipulateImage(event) {
			const normalizedEvent = {
				nativeEvent: event.nativeEvent,
			};
			if (event.scale) {
				normalizedEvent.scale = {
					factor: event.scale.factor || 1,
				};
				if (event.scale.center) {
					normalizedEvent.scale.center = {
						left: event.scale.center.left * this.coefficient + this.visibleArea.left,
						top: event.scale.center.top * this.coefficient + this.visibleArea.top,
					};
				}
			}
			if (event.move) {
				normalizedEvent.move = {
					left: event.move.left ? this.coefficient * event.move.left : 0,
					top: event.move.top ? this.coefficient * event.move.top : 0,
				};
			}
			const { visibleArea, coordinates } = algorithms.manipulateImage({
				event: normalizedEvent,
				coordinates: this.coordinates,
				visibleArea: this.visibleArea,
				areaRestrictions: this.areaRestrictions,
				positionRestrictions: this.positionRestrictions,
				sizeRestrictions: this.sizeRestrictions,
				settings: {
					frozenDirections: this.frozenDirections,
					imageRestriction: this.imageRestriction,
					resizeStencil: this.settings.resize.stencil,
				}
			});

			this.visibleArea = visibleArea;
			this.onChangeCoordinates(coordinates);
		},
		onMove(moveEvent) {
			ALL_DIRECTIONS.forEach(direction => {
				moveEvent.directions[direction] *= this.coefficient;
			});
			this.onChangeCoordinates(
				this.moveAlgorithm({
					moveEvent,
					coordinates: this.coordinates,
					positionRestrictions: this.getPositionRestrictions(),
				})
			);
		},
		onPropsChange() {
			this.applyTransforms(this.coordinates, true);
		},
		applyTransforms(transforms, autoZoom = false) {
			const positionRestrictions = this.positionRestrictions;

			const moveAlgorithm = (prevCoordinates, newCoordinates) => {
				return this.moveAlgorithm({
					coordinates: prevCoordinates,
					positionRestrictions,
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
						sizeRestrictions: this.sizeRestrictions,
						aspectRatio: this.getAspectRatio(),
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
			const { minWidth, minHeight, maxWidth, maxHeight, widthFrozen, heightFrozen } = this.sizeRestrictions;

			// Freeze height or width if there was problems while setting stencil restrictions
			this.frozenDirections.width = Boolean(widthFrozen);
			this.frozenDirections.height = Boolean(heightFrozen);

			const defaultSize = this.defaultSize({
				boundaries: this.boundaries,
				visibleArea: this.visibleArea,
				imageSize: this.imageSize,
				aspectRatio: this.getAspectRatio(),
				sizeRestrictions: this.sizeRestrictions,
				// Maybe this parameters will be removed in the release version
				cropper,
				image,
				imageWidth: this.imageSize.width,
				imageHeight: this.imageSize.height,
				props: this.$props,
				...this.sizeRestrictions,
			});

			if (process.env.NODE_ENV === 'development' && defaultSize.width < minWidth || defaultSize.height < minHeight || defaultSize.width > maxWidth || defaultSize.height > maxHeight) {
				console.warn('Warning: the default size breaks size restrictions. Check your defaultSize function', defaultSize, this.sizeRestrictions);
			}

			const transforms = [
				defaultSize,
				(coordinates) => ({
					...this.defaultPosition({
						visibleArea: this.visibleArea,
						coordinates,
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
				this.boundaries = {
					width: 0,
					height: 0,
				};
			}, this.transitionTime);
		},
		getPositionRestrictions(insideArea = true) {
			return insideArea ? algorithms.limitBy(this.positionRestrictions, this.visibleArea) : this.positionRestrictions;
		},
		refresh() {
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
						this.boundaries = this.defaultBoundaries({
							cropper,
							imageSize: this.imageSize
						});

						const newArea = this.defaultVisibleArea({
							imageSize: this.imageSize,
							boundaries: this.boundaries
						});

						const boundariesRatio = this.boundaries.width / this.boundaries.height;

						if (newArea.width / newArea.height !== boundariesRatio) {
							newArea.height = newArea.width / boundariesRatio;
						}

						const visibleArea = this.updateVisibleArea({
							current: newArea,
							previous: this.visibleArea,
							areaRestrictions: this.areaRestrictions,
							coordinates: this.coordinates,
							boundaries: this.boundaries,
							imageSize: this.imageSize,
						});

						// If visible area was changed the coordinates should be adapted to this changes
						const coordinates = this.fitCoordinates({
							visibleArea,
							coordinates: this.coordinates,
							aspectRatio: this.getAspectRatio(),
							sizeRestrictions: this.sizeRestrictions,
							positionRestrictions: this.getPositionRestrictions({
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
		getAspectRatio() {
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
            :crossorigin="imageAttributes.crossOrigin"
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
