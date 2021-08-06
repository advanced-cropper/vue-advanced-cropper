<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import debounce from 'debounce';
import { RectangleStencil } from './components/stencils';
import { CropperWrapper } from './components/service';
import {
	fillBoundaries,
	fitBoundaries,
	getOptions,
	isBlob,
	isFunction,
	isLoadedImage,
	isNumber,
	isNumeric,
	isObject,
	limitBy,
	radians,
	replacedProp,
} from './core';
import { approximatedSize } from './core/algorithms';
import { updateCanvas } from './core/canvas';
import { ManipulateImageEvent } from './core/events';
import { isEqual, limitSizeRestrictions, limitsToSize, ratio } from './core/service';
import { isLocal, isCrossOriginURL, isUndefined, getSettings, parseNumber } from './core/utils';
import { arrayBufferToDataURL, getImageTransforms, getStyleTransforms, prepareSource, parseImage } from './core/image';
import { IMAGE_RESTRICTIONS, DEFAULT_COORDINATES } from './core/constants';
import * as algorithms from './core/algorithms';

const cn = bem('vue-advanced-cropper');

export default {
	name: 'Cropper',
	components: {
		CropperWrapper,
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
		autoZoom: {
			type: Boolean,
			default: false,
		},
		imageClass: {
			type: String,
		},
		boundariesClass: {
			type: String,
		},
		backgroundClass: {
			type: String,
		},
		foregroundClass: {
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
		transitions: {
			type: Boolean,
			default: true,
		},
		checkOrientation: {
			type: Boolean,
			default: true,
		},
		canvas: {
			type: [Object, Boolean],
			default: true,
		},
		crossOrigin: {
			type: [Boolean, String],
			default: undefined,
		},
		transitionTime: {
			type: Number,
			default: 300,
		},
		imageRestriction: {
			type: String,
			default: 'fit-area',
			validator(value) {
				return IMAGE_RESTRICTIONS.indexOf(value) !== -1;
			},
		},
		roundResult: {
			type: Boolean,
			default: true,
		},
		defaultSize: {
			type: [Function, Object],
		},
		defaultPosition: {
			type: [Function, Object],
			default: algorithms.defaultPosition,
		},
		defaultVisibleArea: {
			type: [Function, Object],
			default: algorithms.defaultVisibleArea,
		},
		defaultBoundaries: {
			type: [Function, String],
			validator(value) {
				const invalid = typeof value === 'string' && value !== 'fill' && value !== 'fit';
				if (invalid) {
					if (process.env.NODE_ENV !== 'production') {
						console.warn(
							`Warning: prop "defaultBoundaries" gets incorrect string value ${value}. It should be either function, 'fill' or 'fit'`,
						);
					}
				}
				return !invalid;
			},
		},
		priority: {
			type: String,
			default: 'coordinates',
		},
		stencilSize: {
			type: [Object, Function],
		},
		resizeImage: {
			type: [Boolean, Object],
			default: true,
		},
		moveImage: {
			type: [Boolean, Object],
			default: true,
		},
		autoZoomAlgorithm: {
			type: Function,
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
			default: algorithms.initStretcher,
		},
		fitCoordinates: {
			type: Function,
			default: algorithms.fitCoordinates,
		},
		fitVisibleArea: {
			type: Function,
			default: algorithms.fitVisibleArea,
		},
		areaRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.dynamicAreaRestrictions,
		},
		sizeRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.pixelsRestrictions,
		},
		positionRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.positionRestrictions,
		},
	},
	data() {
		return {
			transitionsActive: false,
			imageLoaded: false,
			imageAttributes: {
				width: null,
				height: null,
				crossOrigin: false,
				src: null,
			},
			customImageTransforms: {
				rotate: 0,
				flip: {
					horizontal: false,
					vertical: false,
				},
			},
			basicImageTransforms: {
				rotate: 0,
				flip: {
					horizontal: false,
					vertical: false,
				},
			},
			boundaries: {
				width: 0,
				height: 0,
			},
			visibleArea: null,
			coordinates: {
				...DEFAULT_COORDINATES,
			},
		};
	},
	computed: {
		image() {
			return {
				src: this.imageAttributes.src,
				width: this.imageAttributes.width,
				height: this.imageAttributes.height,
				transforms: this.imageTransforms,
			};
		},
		imageTransforms() {
			return {
				rotate: this.basicImageTransforms.rotate + this.customImageTransforms.rotate,
				flip: {
					horizontal: Boolean(
						this.basicImageTransforms.flip.horizontal ^ this.customImageTransforms.flip.horizontal,
					),
					vertical: Boolean(
						this.basicImageTransforms.flip.vertical ^ this.customImageTransforms.flip.vertical,
					),
				},
				translateX: this.visibleArea ? this.visibleArea.left / this.coefficient : 0,
				translateY: this.visibleArea ? this.visibleArea.top / this.coefficient : 0,
				scaleX: 1 / this.coefficient,
				scaleY: 1 / this.coefficient,
			};
		},
		imageSize() {
			const transforms = this.imageTransforms;
			const angle = radians(transforms.rotate);
			return {
				width:
					Math.abs(this.imageAttributes.width * Math.cos(angle)) +
					Math.abs(this.imageAttributes.height * Math.sin(angle)),
				height:
					Math.abs(this.imageAttributes.width * Math.sin(angle)) +
					Math.abs(this.imageAttributes.height * Math.cos(angle)),
			};
		},
		initialized() {
			return Boolean(this.visibleArea && this.imageLoaded);
		},
		settings() {
			const resizeImage = getOptions(
				this.resizeImage,
				{
					touch: true,
					wheel: {
						ratio: 0.1,
					},
					adjustStencil: true,
				},
				{
					touch: false,
					wheel: false,
					adjustStencil: false,
				},
			);

			const moveImage = getOptions(
				this.moveImage,
				{
					touch: true,
					mouse: true,
				},
				{
					touch: false,
					mouse: false,
				},
			);

			return {
				moveImage,
				resizeImage,
			};
		},
		coefficient() {
			return this.visibleArea ? this.visibleArea.width / this.boundaries.width : 0;
		},
		areaRestrictions() {
			if (this.imageLoaded) {
				return this.areaRestrictionsAlgorithm({
					imageSize: this.imageSize,
					imageRestriction: this.imageRestriction,
					boundaries: this.boundaries,
				});
			} else {
				return {};
			}
		},
		transitionsOptions() {
			return {
				enabled: this.transitionsActive,
				timingFunction: 'ease-in-out',
				time: 350,
			};
		},
		sizeRestrictions() {
			if (this.boundaries.width && this.boundaries.height && this.imageSize.width && this.imageSize.height) {
				let sizeRestrictions = this.sizeRestrictionsAlgorithm({
					imageSize: this.imageSize,
					minWidth: !isUndefined(this.minWidth) ? parseNumber(this.minWidth) : 0,
					minHeight: !isUndefined(this.minHeight) ? parseNumber(this.minHeight) : 0,
					maxWidth: !isUndefined(this.maxWidth) ? parseNumber(this.maxWidth) : Infinity,
					maxHeight: !isUndefined(this.maxHeight) ? parseNumber(this.maxHeight) : Infinity,
				});

				sizeRestrictions = algorithms.refineSizeRestrictions({
					sizeRestrictions,
					areaRestrictions: this.getAreaRestrictions({ visibleArea: this.visibleArea, type: 'resize' }),
					imageSize: this.imageSize,
					boundaries: this.boundaries,
					positionRestrictions: this.positionRestrictions,
					imageRestriction: this.imageRestriction,
					visibleArea: this.visibleArea,
					stencilSize: this.getStencilSize(),
				});

				if (this.visibleArea && this.stencilSize) {
					const stencilSize = this.getStencilSize();
					const areaRestrictions = limitsToSize(
						this.getAreaRestrictions({ visibleArea: this.visibleArea, type: 'resize' }),
					);
					sizeRestrictions.maxWidth = Math.min(
						sizeRestrictions.maxWidth,
						(areaRestrictions.width * stencilSize.width) / this.boundaries.width,
					);
					sizeRestrictions.maxHeight = Math.min(
						sizeRestrictions.maxHeight,
						(areaRestrictions.height * stencilSize.height) / this.boundaries.height,
					);
					if (sizeRestrictions.maxWidth < sizeRestrictions.minWidth) {
						if (process.env.NODE_ENV !== 'production') {
							console.warn(
								'Maximum width is smaller than minimum width, because otherwise the area restrictions or stencil size will be broken. Minimum width is reduced.',
							);
						}
						sizeRestrictions.minWidth = sizeRestrictions.maxWidth;
					}
					if (sizeRestrictions.maxHeight < sizeRestrictions.minHeight) {
						if (process.env.NODE_ENV !== 'production') {
							console.warn(
								'Maximum height is smaller than minimum height, because otherwise the area restrictions or stencil size will be broken. Minimum height is reduced.',
							);
						}
						sizeRestrictions.minHeight = sizeRestrictions.maxHeight;
					}
				}
				return sizeRestrictions;
			} else {
				return {
					minWidth: 0,
					minHeight: 0,
					maxWidth: 0,
					maxHeight: 0,
				};
			}
		},
		positionRestrictions() {
			return this.positionRestrictionsAlgorithm({
				imageSize: this.imageSize,
				imageRestriction: this.imageRestriction,
			});
		},
		// Styling
		classes() {
			return {
				cropper: cn(),
				image: classnames(cn('image'), this.imageClass),
				stencil: cn('stencil'),
				boundaries: classnames(cn('boundaries'), this.boundariesClass),
				stretcher: classnames(cn('stretcher')),
				background: classnames(cn('background'), this.backgroundClass),
				foreground: classnames(cn('foreground'), this.foregroundClass),
				imageWrapper: classnames(cn('image-wrapper')),
				cropperWrapper: classnames(cn('cropper-wrapper')),
			};
		},
		stencilCoordinates() {
			if (this.initialized) {
				const { width, height, left, top } = this.coordinates;
				return {
					width: width / this.coefficient,
					height: height / this.coefficient,
					left: (left - this.visibleArea.left) / this.coefficient,
					top: (top - this.visibleArea.top) / this.coefficient,
				};
			} else {
				return this.defaultCoordinates();
			}
		},
		boundariesStyle() {
			const styles = {
				width: this.boundaries.width ? `${Math.round(this.boundaries.width)}px` : 'auto',
				height: this.boundaries.height ? `${Math.round(this.boundaries.height)}px` : 'auto',
				transition: `opacity ${this.transitionTime}ms`,
				pointerEvents: this.imageLoaded ? 'all' : 'none',
			};
			if (!this.imageLoaded) {
				styles.opacity = '0';
			}
			return styles;
		},
		imageStyle() {
			const optimalImageSize =
				this.imageAttributes.width > this.imageAttributes.height
					? {
							width: Math.min(1024, this.imageAttributes.width),
							height:
								Math.min(1024, this.imageAttributes.width) /
								(this.imageAttributes.width / this.imageAttributes.height),
					  }
					: {
							height: Math.min(1024, this.imageAttributes.height),
							width:
								Math.min(1024, this.imageAttributes.height) *
								(this.imageAttributes.width / this.imageAttributes.height),
					  };

			const compensations = {
				rotate: {
					left: (optimalImageSize.width - this.imageSize.width) / (2 * this.coefficient),
					top: (optimalImageSize.height - this.imageSize.height) / (2 * this.coefficient),
				},
				scale: {
					left: ((1 - 1 / this.coefficient) * optimalImageSize.width) / 2,
					top: ((1 - 1 / this.coefficient) * optimalImageSize.height) / 2,
				},
			};

			const transforms = {
				...this.imageTransforms,
				scaleX: this.imageTransforms.scaleX * (this.imageAttributes.width / optimalImageSize.width),
				scaleY: this.imageTransforms.scaleY * (this.imageAttributes.height / optimalImageSize.height),
			};

			const result = {
				width: `${optimalImageSize.width}px`,
				height: `${optimalImageSize.height}px`,
				left: '0px',
				top: '0px',
				transform:
					`translate(${
						-compensations.rotate.left - compensations.scale.left - this.imageTransforms.translateX
					}px, ${-compensations.rotate.top - compensations.scale.top - this.imageTransforms.translateY}px)` +
					getStyleTransforms(transforms),
			};

			if (this.transitionsOptions.enabled) {
				result.transition = `${this.transitionsOptions.time}ms ${this.transitionsOptions.timingFunction}`;
			}
			return result;
		},
	},
	watch: {
		src() {
			this.onChangeImage();
		},
		stencilComponent() {
			this.$nextTick(() => {
				this.resetCoordinates();
				this.runAutoZoom('setCoordinates');
				this.onChange();
			});
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
			this.reset();
		},
		stencilProps(oldProps, newProps) {
			const significantProps = ['aspectRatio', 'minAspectRatio', 'maxAspectRatio'];
			if (significantProps.find((prop) => oldProps[prop] !== newProps[prop])) {
				this.$nextTick(this.onPropsChange);
			}
		},
	},
	created() {
		this.debouncedUpdate = debounce(this.update, this.debounce);
		this.debouncedDisableTransitions = debounce(this.disableTransitions, this.transitionsOptions.time);
		this.awaiting = false;
	},
	mounted() {
		this.$refs.image.addEventListener('load', this.onSuccessLoadImage);
		this.$refs.image.addEventListener('error', this.onFailLoadImage);
		this.onChangeImage();

		// Add listeners to window to adapt the cropper to window changes
		window.addEventListener('resize', this.refresh);
		window.addEventListener('orientationchange', this.refresh);
	},
	destroyed() {
		window.removeEventListener('resize', this.refresh);
		window.removeEventListener('orientationchange', this.refresh);
		if (this.imageAttributes.revoke && this.imageAttributes.src) {
			URL.revokeObjectURL(this.imageAttributes.src);
		}
	},
	methods: {
		// External methods
		getResult() {
			const coordinates = this.initialized
				? this.prepareResult({ ...this.coordinates })
				: this.defaultCoordinates();
			const imageTransforms = {
				rotate: this.imageTransforms.rotate % 360,
				flip: {
					...this.imageTransforms.flip,
				},
			};
			if (this.src && this.imageLoaded) {
				const cropper = this;
				return {
					image: this.image,
					coordinates,
					visibleArea: this.visibleArea ? { ...this.visibleArea } : null,
					imageTransforms,
					get canvas() {
						if (cropper.canvas) {
							return cropper.getCanvas();
						} else {
							return undefined;
						}
					},
				};
			} else {
				return {
					image: this.image,
					coordinates,
					visibleArea: this.visibleArea ? { ...this.visibleArea } : null,
					canvas: undefined,
					imageTransforms,
				};
			}
		},
		zoom(factor, center, params = {}) {
			const { transitions = true } = params;

			this.onManipulateImage(
				new ManipulateImageEvent(
					{},
					{
						factor: 1 / factor,
						center,
					},
				),
				{
					normalize: false,
					transitions,
				},
			);
		},
		move(left, top, params = {}) {
			const { transitions = true } = params;

			this.onManipulateImage(
				new ManipulateImageEvent({
					left: left || 0,
					top: top || 0,
				}),
				{
					normalize: false,
					transitions,
				},
			);
		},
		setCoordinates(transforms, params = {}) {
			const { autoZoom = true, transitions = true } = params;
			this.$nextTick(() => {
				if (!this.imageLoaded) {
					this.delayedTransforms = transforms;
				} else {
					if (!this.transitionsActive) {
						if (transitions) {
							this.enableTransitions();
						}
						this.coordinates = this.applyTransform(transforms);
						if (autoZoom) {
							this.runAutoZoom('setCoordinates');
						}
						if (transitions) {
							this.debouncedDisableTransitions();
						}
					}
					this.onChange();
				}
			});
		},
		refresh() {
			const image = this.$refs.image;
			if (this.src && image) {
				let promise;
				if (this.initialized) {
					return this.updateVisibleArea().then(() => {
						this.onChange();
					});
				} else {
					return this.resetVisibleArea().then(() => {
						this.onChange();
					});
				}
			}
		},
		reset() {
			return this.resetVisibleArea().then(() => {
				this.onChange();
			});
		},
		// Internal methods
		awaitRender(callback) {
			if (!this.awaiting) {
				this.awaiting = true;
				this.$nextTick(() => {
					callback();
					this.awaiting = false;
				});
			}
		},
		prepareResult(coordinates) {
			if (this.roundResult) {
				return algorithms.roundCoordinates({
					...this.getPublicProperties(),
					positionRestrictions: algorithms.limitBy(this.positionRestrictions, this.visibleArea),
					coordinates,
				});
			} else {
				return coordinates;
			}
		},
		processAutoZoom(type, visibleArea, coordinates, params) {
			let algorithm = this.autoZoomAlgorithm;

			if (!algorithm) {
				if (this.stencilSize) {
					algorithm = algorithms.fixedStencilAutoZoom;
				} else if (this.autoZoom) {
					algorithm = algorithms.hybridStencilAutoZoom;
				} else {
					algorithm = algorithms.simplestAutoZoom;
				}
			}

			const result = algorithm({
				event: {
					type,
					params,
				},
				visibleArea,
				coordinates,
				boundaries: this.boundaries,
				aspectRatio: this.getAspectRatio(),
				positionRestrictions: this.positionRestrictions,
				getAreaRestrictions: this.getAreaRestrictions,
				sizeRestrictions: this.sizeRestrictions,
				stencilSize: this.getStencilSize(),
			});

			return {
				...result,
				changed: !isEqual(result.visibleArea, visibleArea) || !isEqual(result.coordinates, coordinates),
			};
		},
		runAutoZoom(event, params = {}) {
			const { transitions = false, ...payload } = params;

			const { visibleArea, coordinates, changed } = this.processAutoZoom(
				event,
				this.visibleArea,
				this.coordinates,
				payload,
			);

			if (transitions && changed) {
				this.enableTransitions();
			}

			this.visibleArea = visibleArea;
			this.coordinates = coordinates;

			if (transitions && changed) {
				this.debouncedDisableTransitions();
			}
		},
		normalizeEvent(event) {
			return algorithms.normalizeEvent({
				...this.getPublicProperties(),
				event,
			});
		},
		getCanvas() {
			// This function can be asynchronously called because it's debounced
			// Therefore there is workaround to prevent processing after the component was unmounted
			if (this.$refs.canvas) {
				const canvas = this.$refs.canvas;
				const image = this.$refs.image;
				const imageTransformed =
					this.imageTransforms.rotate !== 0 ||
					this.imageTransforms.flip.horizontal ||
					this.imageTransforms.flip.vertical;
				const source = imageTransformed
					? prepareSource(this.$refs.sourceCanvas, image, this.imageTransforms)
					: image;

				const options = {
					minWidth: 0,
					minHeight: 0,
					maxWidth: Infinity,
					maxHeight: Infinity,
					maxArea: this.maxCanvasSize,
					imageSmoothingEnabled: true,
					imageSmoothingQuality: 'high',
					fillColor: 'transparent',
					...this.canvas,
				};

				const firstNumeric = (array) => array.find((el) => isNumeric(el));

				let size = approximatedSize({
					sizeRestrictions: {
						minWidth: firstNumeric([options.width, options.minWidth]) || 0,
						minHeight: firstNumeric([options.height, options.minHeight]) || 0,
						maxWidth: firstNumeric([options.width, options.maxWidth]) || Infinity,
						maxHeight: firstNumeric([options.height, options.maxHeight]) || Infinity,
					},
					width: this.coordinates.width,
					height: this.coordinates.height,
					aspectRatio: {
						minimum: this.coordinates.width / this.coordinates.height,
						maximum: this.coordinates.width / this.coordinates.height,
					},
				});

				if (options.maxArea && size.width * size.height > options.maxArea) {
					const scale = Math.sqrt(options.maxArea / (size.width * size.height));
					size = {
						width: Math.round(scale * size.width),
						height: Math.round(scale * size.height),
					};
				}

				updateCanvas(canvas, source, this.coordinates, size, options);

				return canvas;
			}
		},
		update() {
			this.$emit('change', this.getResult());
		},
		applyTransform(transform, limited = false) {
			const sizeRestrictions =
				this.visibleArea && limited
					? limitSizeRestrictions(this.sizeRestrictions, this.visibleArea)
					: this.sizeRestrictions;

			const positionRestrictions =
				this.visibleArea && limited
					? limitBy(this.positionRestrictions, this.visibleArea)
					: this.positionRestrictions;

			return algorithms.applyTransform({
				transform,
				coordinates: this.coordinates,
				imageSize: this.imageSize,
				sizeRestrictions,
				positionRestrictions,
				aspectRatio: this.getAspectRatio(),
				visibleArea: this.visibleArea,
			});
		},
		resetCoordinates() {
			// This function can be asynchronously called after completion of refreshing image promise
			// Therefore there is a workaround to prevent processing after the component was unmounted
			// Also coordinates can't be reset if visible area was not initialized
			if (this.$refs.image) {
				const cropper = this.$refs.cropper;
				const image = this.$refs.image;

				let defaultSizeAlgorithm = this.defaultSize;
				if (!defaultSizeAlgorithm) {
					if (this.stencilSize) {
						defaultSizeAlgorithm = algorithms.fixedDefaultSize;
					} else {
						defaultSizeAlgorithm = algorithms.defaultSize;
					}
				}

				const { minWidth, minHeight, maxWidth, maxHeight } = this.sizeRestrictions;

				const defaultSize = isFunction(defaultSizeAlgorithm)
					? defaultSizeAlgorithm({
							boundaries: this.boundaries,
							imageSize: this.imageSize,
							aspectRatio: this.getAspectRatio(),
							sizeRestrictions: this.sizeRestrictions,
							stencilSize: this.getStencilSize(),
							visibleArea: this.visibleArea,
					  })
					: defaultSizeAlgorithm;

				if (
					process.env.NODE_ENV === 'development' &&
					(defaultSize.width < minWidth ||
						defaultSize.height < minHeight ||
						defaultSize.width > maxWidth ||
						defaultSize.height > maxHeight)
				) {
					console.warn(
						'Warning: the default size breaks size restrictions. Check your defaultSize function',
						defaultSize,
						this.sizeRestrictions,
					);
				}

				const transforms = [
					defaultSize,
					({ coordinates }) => ({
						...(isFunction(this.defaultPosition)
							? this.defaultPosition({
									coordinates,
									imageSize: this.imageSize,
									visibleArea: this.visibleArea,
							  })
							: this.defaultPosition),
					}),
				];

				if (this.delayedTransforms) {
					transforms.push(
						...(Array.isArray(this.delayedTransforms) ? this.delayedTransforms : [this.delayedTransforms]),
					);
				}
				this.coordinates = this.applyTransform(transforms, true);
				this.delayedTransforms = null;
			}
		},
		clearImage() {
			this.imageLoaded = false;
			setTimeout(() => {
				const stretcher = this.$refs.stretcher;
				if (stretcher) {
					stretcher.style.height = 'auto';
					stretcher.style.width = 'auto';
				}
				this.coordinates = this.defaultCoordinates();
				this.boundaries = {
					width: 0,
					height: 0,
				};
			}, this.transitionTime);
		},
		enableTransitions() {
			if (this.transitions) {
				this.transitionsActive = true;
			}
		},
		disableTransitions() {
			this.transitionsActive = false;
		},
		updateBoundaries() {
			const stretcher = this.$refs.stretcher;
			const cropper = this.$refs.cropper;

			this.initStretcher({
				cropper,
				stretcher,
				imageSize: this.imageSize,
			});

			return this.$nextTick().then(() => {
				const params = {
					cropper,
					imageSize: this.imageSize,
				};

				if (isFunction(this.defaultBoundaries)) {
					this.boundaries = this.defaultBoundaries(params);
				} else if (this.defaultBoundaries === 'fit') {
					this.boundaries = fitBoundaries(params);
				} else {
					this.boundaries = fillBoundaries(params);
				}

				if (!this.boundaries.width || !this.boundaries.height) {
					throw new Error("It's impossible to fit the cropper in the current container");
				}
			});
		},
		resetVisibleArea() {
			return this.updateBoundaries()
				.then(() => {
					if (this.priority !== 'visible-area') {
						this.visibleArea = null;
						this.resetCoordinates();
					}

					this.visibleArea = isFunction(this.defaultVisibleArea)
						? this.defaultVisibleArea({
								imageSize: this.imageSize,
								boundaries: this.boundaries,
								coordinates: this.priority !== 'visible-area' ? this.coordinates : null,
								getAreaRestrictions: this.getAreaRestrictions,
								stencilSize: this.getStencilSize(),
						  })
						: this.defaultVisibleArea;

					this.visibleArea = algorithms.refineVisibleArea({
						visibleArea: this.visibleArea,
						boundaries: this.boundaries,
						getAreaRestrictions: this.getAreaRestrictions,
					});

					if (this.priority === 'visible-area') {
						this.resetCoordinates();
					} else {
						this.coordinates = this.fitCoordinates({
							visibleArea: this.visibleArea,
							coordinates: this.coordinates,
							aspectRatio: this.getAspectRatio(),
							positionRestrictions: this.positionRestrictions,
							sizeRestrictions: this.sizeRestrictions,
						});
					}
					this.runAutoZoom('resetVisibleArea');
				})
				.catch(() => {
					this.visibleArea = null;
				});
		},
		updateVisibleArea() {
			return this.updateBoundaries()
				.then(() => {
					this.visibleArea = this.fitVisibleArea({
						imageSize: this.imageSize,
						boundaries: this.boundaries,
						visibleArea: this.visibleArea,
						coordinates: this.coordinates,
						getAreaRestrictions: this.getAreaRestrictions,
					});
					this.coordinates = this.fitCoordinates({
						visibleArea: this.visibleArea,
						coordinates: this.coordinates,
						aspectRatio: this.getAspectRatio(),
						positionRestrictions: this.positionRestrictions,
						sizeRestrictions: this.sizeRestrictions,
					});
					this.runAutoZoom('updateVisibleArea');
				})
				.catch(() => {
					this.visibleArea = null;
				});
		},
		onChange(debounce = true) {
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

			if (this.src) {
				if (isCrossOriginURL(this.src)) {
					let crossOrigin = isUndefined(this.crossOrigin) ? this.canvas : this.crossOrigin;
					if (crossOrigin === true) {
						crossOrigin = 'anonymous';
					}
					this.imageAttributes.crossOrigin = crossOrigin;
				}
				if (this.checkOrientation) {
					const promise = parseImage(this.src);
					setTimeout(() => {
						promise.then(this.onParseImage);
					}, this.transitionTime);
				} else {
					setTimeout(() => {
						this.onParseImage({ source: this.src });
					}, this.transitionTime);
				}
			} else {
				this.clearImage();
			}
		},
		onFailLoadImage() {
			if (this.imageAttributes.src) {
				this.clearImage();
				this.$emit('error');
			}
		},
		onSuccessLoadImage() {
			// After loading image the current component can be unmounted
			// Therefore there is a workaround to prevent processing the following code
			const image = this.$refs.image;
			if (image && !this.imageLoaded) {
				this.imageAttributes.height = image.naturalHeight;
				this.imageAttributes.width = image.naturalWidth;
				this.imageLoaded = true;
				this.reset().then(() => {
					this.$emit('ready');
					this.onChange(false);
				});
			}
		},
		onParseImage({ source, arrayBuffer, orientation }) {
			if (this.imageAttributes.revoke && this.imageAttributes.src) {
				URL.revokeObjectURL(this.imageAttributes.src);
			}
			this.imageAttributes.revoke = false;
			if (arrayBuffer && orientation && orientation > 1 && isLocal(source)) {
				if (isBlob(source)) {
					this.imageAttributes.src = URL.createObjectURL(new Blob([arrayBuffer]));
					this.imageAttributes.revoke = true;
				} else {
					this.imageAttributes.src = arrayBufferToDataURL(arrayBuffer);
				}
			} else {
				this.imageAttributes.src = source;
			}
			this.customImageTransforms = {
				rotate: 0,
				flip: {
					horizontal: false,
					vertical: false,
				},
			};
			this.basicImageTransforms = {
				...this.customImageTransforms,
				...getImageTransforms(orientation),
			};
			this.$nextTick(() => {
				const image = this.$refs.image;
				if (image && image.complete) {
					if (isLoadedImage(image)) {
						this.onSuccessLoadImage();
					} else {
						this.onFailLoadImage();
					}
				}
			});
		},
		onResizeEnd() {
			this.runAutoZoom('resize', {
				transitions: true,
			});
		},
		onMoveEnd() {
			this.runAutoZoom('move', {
				transitions: true,
			});
		},
		onMove(event) {
			if (!this.transitionsOptions.enabled) {
				this.awaitRender(() => {
					this.coordinates = this.moveAlgorithm({
						...this.getPublicProperties(),
						positionRestrictions: algorithms.limitBy(this.positionRestrictions, this.visibleArea),
						coordinates: this.coordinates,
						event: this.normalizeEvent(event),
					});
					this.onChange();
				});
			}
		},
		onResize(event) {
			if (!this.transitionsOptions.enabled && (!this.stencilSize || this.autoZoom)) {
				this.awaitRender(() => {
					const sizeRestrictions = this.sizeRestrictions;

					// The magic number is the approximation of the handler size
					// Temporary solution that should be improved in the future
					const minimumSize = Math.min(
						this.coordinates.width,
						this.coordinates.height,
						20 * this.coefficient,
					);

					this.coordinates = this.resizeAlgorithm({
						...this.getPublicProperties(),
						positionRestrictions: algorithms.limitBy(this.positionRestrictions, this.visibleArea),
						sizeRestrictions: {
							maxWidth: Math.min(sizeRestrictions.maxWidth, this.visibleArea.width),
							maxHeight: Math.min(sizeRestrictions.maxHeight, this.visibleArea.height),
							minWidth: Math.max(sizeRestrictions.minWidth, minimumSize),
							minHeight: Math.max(sizeRestrictions.minHeight, minimumSize),
						},
						event: this.normalizeEvent(event),
					});
					this.onChange();
					this.ticking = false;
				});
			}
		},
		onManipulateImage(event, params = {}) {
			if (!this.transitionsOptions.enabled) {
				const { transitions = false, normalize = true } = params;
				if (transitions) {
					this.enableTransitions();
				}
				const { visibleArea, coordinates } = algorithms.manipulateImage({
					...this.getPublicProperties(),
					event: normalize ? this.normalizeEvent(event) : event,
					getAreaRestrictions: this.getAreaRestrictions,
					imageRestriction: this.imageRestriction,
					adjustStencil: !this.stencilSize && this.settings.resizeImage.adjustStencil,
				});

				this.visibleArea = visibleArea;
				this.coordinates = coordinates;

				this.runAutoZoom('manipulateImage');

				this.onChange();

				if (transitions) {
					this.debouncedDisableTransitions();
				}
			}
		},
		onPropsChange() {
			this.coordinates = this.applyTransform(this.coordinates, true);
			this.onChange(false);
		},
		getAreaRestrictions({ visibleArea, type = 'move' } = {}) {
			return this.areaRestrictionsAlgorithm({
				boundaries: this.boundaries,
				imageSize: this.imageSize,
				imageRestriction: this.imageRestriction,
				visibleArea,
				type,
			});
		},
		getAspectRatio(ignoreStencil) {
			let minimum, maximum;
			const { aspectRatio, minAspectRatio, maxAspectRatio } = this.stencilProps;

			if (this.$refs.stencil.aspectRatios) {
				({ minimum, maximum } = this.$refs.stencil.aspectRatios());
			}

			if (isUndefined(minimum)) {
				minimum = !isUndefined(aspectRatio) ? aspectRatio : minAspectRatio;
			}
			if (isUndefined(maximum)) {
				maximum = !isUndefined(aspectRatio) ? aspectRatio : maxAspectRatio;
			}

			if (!ignoreStencil && (isUndefined(minimum) || isUndefined(maximum))) {
				const stencilSize = this.getStencilSize();
				const stencilRatio = stencilSize ? ratio(stencilSize) : null;
				if (isUndefined(minimum)) {
					minimum = isNumber(stencilRatio) ? stencilRatio : undefined;
				}
				if (isUndefined(maximum)) {
					maximum = isNumber(stencilRatio) ? stencilRatio : undefined;
				}
			}
			return {
				minimum,
				maximum,
			};
		},
		getStencilSize() {
			if (this.stencilSize) {
				return algorithms.calculateStencilSize({
					currentStencilSize: {
						width: this.stencilCoordinates.width,
						height: this.stencilCoordinates.height,
					},
					stencilSize: this.stencilSize,
					boundaries: this.boundaries,
					coefficient: this.coefficient,
					coordinates: this.coordinates,
					aspectRatio: this.getAspectRatio(true),
				});
			}
		},
		getPublicProperties() {
			return {
				coefficient: this.coefficient,
				visibleArea: this.visibleArea,
				coordinates: this.coordinates,
				boundaries: this.boundaries,
				sizeRestrictions: this.sizeRestrictions,
				positionRestrictions: this.positionRestrictions,
				aspectRatio: this.getAspectRatio(),
				imageRestriction: this.imageRestriction,
			};
		},
		defaultCoordinates() {
			return { ...DEFAULT_COORDINATES };
		},
		flip(horizontal, vertical, options = {}) {
			const { transitions = true } = options;
			if (!this.transitionsActive) {
				if (transitions) {
					this.enableTransitions();
				}

				const previousFlip = {
					...this.imageTransforms.flip,
				};

				let { visibleArea, coordinates } = algorithms.flipImage({
					flip: {
						horizontal: horizontal ? !previousFlip.horizontal : previousFlip.horizontal,
						vertical: vertical ? !previousFlip.vertical : previousFlip.vertical,
					},
					previousFlip,
					rotate: this.imageTransforms.rotate,
					visibleArea: this.visibleArea,
					coordinates: this.coordinates,
					imageSize: this.imageSize,
					positionRestrictions: this.positionRestrictions,
					sizeRestrictions: this.sizeRestrictions,
					getAreaRestrictions: this.getAreaRestrictions,
					aspectRatio: this.getAspectRatio(),
				});

				if (horizontal) {
					this.customImageTransforms.flip.horizontal = !this.customImageTransforms.flip.horizontal;
				}
				if (vertical) {
					this.customImageTransforms.flip.vertical = !this.customImageTransforms.flip.vertical;
				}

				this.visibleArea = visibleArea;
				this.coordinates = coordinates;

				this.onChange();
				if (transitions) {
					this.debouncedDisableTransitions();
				}
			}
		},
		rotate(angle, options = {}) {
			const { transitions = true } = options;

			if (!this.transitionsActive) {
				if (transitions) {
					this.enableTransitions();
				}
				const previousImageSize = { ...this.imageSize };

				this.customImageTransforms.rotate += angle;
				let { visibleArea, coordinates } = algorithms.rotateImage({
					visibleArea: this.visibleArea,
					coordinates: this.coordinates,
					previousImageSize,
					imageSize: this.imageSize,
					angle,
					positionRestrictions: this.positionRestrictions,
					sizeRestrictions: this.sizeRestrictions,
					getAreaRestrictions: this.getAreaRestrictions,
					aspectRatio: this.getAspectRatio(),
				});

				({ visibleArea, coordinates } = this.processAutoZoom('rotateImage', visibleArea, coordinates));

				this.visibleArea = visibleArea;
				this.coordinates = coordinates;

				this.onChange();

				if (transitions) {
					this.debouncedDisableTransitions();
				}
			}
		},
	},
};
</script>

<template>
	<div ref="cropper" :class="classes.cropper">
		<div ref="stretcher" :class="classes.stretcher" />

		<div :class="classes.boundaries" :style="boundariesStyle">
			<cropper-wrapper
				:class="classes.cropperWrapper"
				:wheel-resize="settings.resizeImage.wheel"
				:touch-resize="settings.resizeImage.touch"
				:touch-move="settings.moveImage.touch"
				:mouse-move="settings.moveImage.mouse"
				@move="onManipulateImage"
				@resize="onManipulateImage"
			>
				<div :class="classes.background" :style="boundariesStyle"></div>
				<div :class="classes.imageWrapper">
					<img
						ref="image"
						:crossorigin="imageAttributes.crossOrigin"
						:src="imageAttributes.src"
						:class="classes.image"
						:style="imageStyle"
						@mousedown.prevent
					/>
				</div>
				<div :class="classes.foreground" :style="boundariesStyle"></div>
				<component
					:is="stencilComponent"
					v-show="imageLoaded"
					ref="stencil"
					:image="image"
					:coordinates="coordinates"
					:stencil-coordinates="stencilCoordinates"
					:transitions="transitionsOptions"
					v-bind="stencilProps"
					@resize="onResize"
					@resize-end="onResizeEnd"
					@move="onMove"
					@move-end="onMoveEnd"
				/>
				<canvas v-if="canvas" ref="canvas" :style="{ display: 'none' }" />
				<canvas v-if="canvas" ref="sourceCanvas" :style="{ display: 'none' }" />
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
		user-select: none;
		position: absolute;
		transform-origin: center;
		// Workaround to prevent bugs at the websites with max-width
		// rule applied to img (Vuepress for example)
		max-width: none !important;
	}
	&__background,
	&__foreground {
		opacity: 1;
		background: black;
		transform: translate(-50%, -50%);
		position: absolute;
		top: 50%;
		left: 50%;
	}
	&__foreground {
		opacity: 0.5;
	}
	&__boundaries {
		opacity: 1;
		transform: translate(-50%, -50%);
		position: absolute;
		left: 50%;
		top: 50%;
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
