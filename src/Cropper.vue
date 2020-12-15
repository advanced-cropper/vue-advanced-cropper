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
	isFunction,
	isLoadedImage,
	isNumber,
	isObject,
	limitBy,
	radians,
	replacedProp,
} from './core';
import { updateCanvas } from './core/canvas';
import { ManipulateImageEvent } from './core/events';
import { limitSizeRestrictions, limitsToSize, ratio } from './core/service';
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
			default: false,
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
			default: 'anonymous',
		},
		transitionTime: {
			type: Number,
			default: 300,
		},
		imageRestriction: {
			type: String,
			default: 'fill-area',
			validator(value) {
				return IMAGE_RESTRICTIONS.indexOf(value) !== -1;
			},
		},
		roundResult: {
			type: Boolean,
			default: true,
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
		defaultVisibleArea: {
			type: [Function, Object],
			default: algorithms.defaultVisibleArea,
		},
		defaultSize: {
			type: [Function, Object],
		},
		defaultPosition: {
			type: [Function, Object],
			default: algorithms.defaultPosition,
		},
		defaultBoundaries: {
			type: [Function, String],
			default: algorithms.fitBoundaries,
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
		autoZoomAlgorithm: {
			type: Function,
		},
		areaRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.dynamicAreaRestrictions,
		},
		sizeRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.percentRestrictions,
		},
		positionRestrictionsAlgorithm: {
			type: Function,
			default: algorithms.positionRestrictions,
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
		// Deprecated props
		restrictions: {
			type: Function,
			validator(value) {
				return replacedProp(value, 'restrictions', 'sizeRestrictionsAlgorithm');
			},
		},
		classname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'classname', 'class');
			},
		},
		imageClassname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'imageClassname', 'imageClass');
			},
		},
		areaClassname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'areaClassname', 'boundariesClass');
			},
		},
		backgroundClassname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'backgroundClassname', 'backgroundClass');
			},
		},
		areaClass: {
			type: String,
			validator(value) {
				return replacedProp(value, 'areaClass', 'boundariesClass');
			},
		},
		wheelResize: {
			validator(value) {
				return replacedProp(
					value,
					'wheelResize',
					'resizeImage (https://norserium.github.io/vue-advanced-cropper/components/cropper.html#resizeimage)',
				);
			},
		},
		touchResize: {
			validator(value) {
				return replacedProp(
					value,
					'touchResize',
					'resizeImage (https://norserium.github.io/vue-advanced-cropper/components/cropper.html#resizeimage)',
				);
			},
		},
		touchMove: {
			validator(value) {
				return replacedProp(
					value,
					'touchMove',
					'moveImage (https://norserium.github.io/vue-advanced-cropper/components/cropper.html#moveimage)',
				);
			},
		},
		mouseMove: {
			validator(value) {
				return replacedProp(
					value,
					'mouseMove',
					'moveImage (https://norserium.github.io/vue-advanced-cropper/components/cropper.html#moveimage)',
				);
			},
		},
	},
	data() {
		return {
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
			transitionsActive: false,
			visibleArea: null,
			coordinates: {
				...DEFAULT_COORDINATES,
			},
		};
	},
	computed: {
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
			// Deprecated
			const resizeImageSettings = isUndefined(this.resizeImage)
				? {
						touch: getSettings(this.touchResize),
						wheel: getSettings(this.wheelResize, {
							ratio: 0.1,
						}),
				  }
				: this.resizeImage;

			const resizeImage = getOptions(
				resizeImageSettings,
				{
					touch: true,
					wheel: {
						ratio: 0.1,
					},
					adjustStencil: false,
				},
				{
					touch: false,
					wheel: false,
					adjustStencil: false,
				},
			);

			// Deprecated
			const moveImageSettings = isUndefined(this.moveImage)
				? {
						touch: getSettings(this.touchMove),
						mouse: getSettings(this.mouseMove),
				  }
				: this.moveImage;

			const moveImage = getOptions(
				moveImageSettings,
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
		// Restrictions
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
			if (this.boundaries.width && this.boundaries.height) {
				let sizeRestrictions = (this.restrictions || this.sizeRestrictionsAlgorithm)({
					imageSize: this.imageSize,
					minWidth: !isUndefined(this.minWidth) ? parseNumber(this.minWidth) : 0,
					minHeight: !isUndefined(this.minHeight) ? parseNumber(this.minHeight) : 0,
					maxWidth: !isUndefined(this.maxWidth) ? parseNumber(this.maxWidth) : Infinity,
					maxHeight: !isUndefined(this.maxHeight) ? parseNumber(this.maxHeight) : Infinity,
					// Deprecated params
					imageWidth: this.imageSize.width,
					imageHeight: this.imageSize.height,
					props: this.$props,
				});

				sizeRestrictions = algorithms.refineSizeRestrictions({
					sizeRestrictions,
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
				cropper: classnames(cn(), this.classname),
				image: classnames(cn('image'), this.imageClass || this.imageClassname),
				boundaries: classnames(cn('boundaries'), this.boundariesClass || this.areaClass || this.areaClassname),
				stretcher: classnames(cn('stretcher')),
				background: classnames(cn('background'), this.backgroundClass || this.backgroundClassname),
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
		wrapperStyle() {
			return {
				width: `${this.stencilCoordinates.width}px`,
				height: `${this.stencilCoordinates.height}px`,
				left: `${this.stencilCoordinates.left}px`,
				top: `${this.stencilCoordinates.top}px`,
			};
		},
		boundariesStyle() {
			return {
				width: this.boundaries.width ? `${this.boundaries.width}px` : 'auto',
				height: this.boundaries.height ? `${this.boundaries.height}px` : 'auto',
				opacity: this.imageLoaded ? 1 : 0,
				transition: `opacity ${this.transitionTime}ms`,
				pointerEvents: this.imageLoaded ? 'all' : 'none',
			};
		},
		imageStyle() {
			const result = {
				left: `${this.imageSize.width / (2 * this.coefficient) - this.imageTransforms.translateX}px`,
				top: `${this.imageSize.height / (2 * this.coefficient) - this.imageTransforms.translateY}px`,
				transform: `translate(-50%, -50%)` + getStyleTransforms(this.imageTransforms),
			};

			if (this.transitionsOptions.enabled) {
				result.transition = `${this.transitionsOptions.time}ms ${this.transitionsOptions.timingFunction}`;
			}

			result.width = `${this.imageAttributes.width / this.coefficient}px`;
			result.height = `${this.imageAttributes.height / this.coefficient}px`;
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
	},
	methods: {
		// External methods
		getResult(canvas) {
			const coordinates = this.initialized
				? this.prepareResult({ ...this.coordinates })
				: this.defaultCoordinates();
			const imageTransforms = {
				rotate: this.imageTransforms.rotate % 360,
				flip: {
					...this.imageTransforms.flip,
				},
			};
			if ((canvas || this.canvas) && this.src && this.imageLoaded) {
				this.updateCanvas();
				return {
					coordinates,
					visibleArea: this.visibleArea ? { ...this.visibleArea } : null,
					canvas: this.$refs.canvas,
					imageTransforms,
				};
			} else {
				return {
					coordinates,
					visibleArea: this.visibleArea ? { ...this.visibleArea } : null,
					canvas: undefined,
					imageTransforms,
				};
			}
		},
		zoom(factor, center) {
			this.onManipulateImage(
				new ManipulateImageEvent(
					{},
					{
						factor: 1 / factor,
						center,
					},
				),
				false,
			);
		},
		move(left, top) {
			this.onManipulateImage(
				// Multiplying on coefficient is temporary solution
				new ManipulateImageEvent({
					left: left || 0,
					top: top || 0,
				}),
				false,
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
				}
			});
		},
		refresh() {
			const image = this.$refs.image;
			if (this.src && image) {
				if (this.initialized) {
					return this.updateVisibleArea();
				} else {
					return this.reset();
				}
			}
		},
		reset() {
			return this.resetVisibleArea();
		},
		// Internal methods
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

			return algorithm({
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
		},
		runAutoZoom(event, params = {}) {
			const { transitions = false, ...payload } = params;

			if (transitions) {
				this.enableTransitions();
			}

			const { visibleArea, coordinates } = this.processAutoZoom(
				event,
				this.visibleArea,
				this.coordinates,
				payload,
			);

			this.visibleArea = visibleArea;
			this.coordinates = coordinates;

			if (transitions) {
				this.debouncedDisableTransitions();
			}
		},
		normalizeEvent(event) {
			return algorithms.normalizeEvent({
				...this.getPublicProperties(),
				event,
			});
		},
		updateCanvas() {
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

				updateCanvas(canvas, source, this.coordinates);
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
							// Deprecated params
							cropper,
							image,
							imageWidth: this.imageSize.width,
							imageHeight: this.imageSize.height,
							props: this.$props,
							...this.sizeRestrictions,
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
					(coordinates) => ({
						...(isFunction(this.defaultPosition)
							? this.defaultPosition({
									coordinates,
									imageSize: this.imageSize,
									visibleArea: this.visibleArea,
									// Deprecated params
									cropper,
									image,
									stencilWidth: coordinates.width,
									stencilHeight: coordinates.height,
									imageWidth: this.imageSize.width,
									imageHeight: this.imageSize.height,
									props: this.$props,
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
				} else if (this.defaultBoundaries === 'fill') {
					this.boundaries = fillBoundaries(params);
				} else {
					this.boundaries = fitBoundaries(params);
				}

				if (!this.boundaries.width || !this.boundaries.height) {
					throw new Error("It's impossible to fit the cropper in the current container");
				}
			});
		},
		resetVisibleArea() {
			return this.updateBoundaries()
				.then(() => {
					if (this.priority !== 'visibleArea') {
						this.visibleArea = null;
						this.resetCoordinates();
					}

					this.visibleArea = isFunction(this.defaultVisibleArea)
						? this.defaultVisibleArea({
								imageSize: this.imageSize,
								boundaries: this.boundaries,
								coordinates: this.priority !== 'visibleArea' ? this.coordinates : null,
								getAreaRestrictions: this.getAreaRestrictions,
								stencilSize: this.getStencilSize(),
								// Deprecated
								areaRestrictions: this.areaRestrictions,
						  })
						: this.defaultVisibleArea;

					this.visibleArea = algorithms.refineVisibleArea({
						visibleArea: this.visibleArea,
						boundaries: this.boundaries,
						getAreaRestrictions: this.getAreaRestrictions,
					});

					if (this.priority === 'visibleArea') {
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
						// Deprecated
						areaRestrictions: this.areaRestrictions,
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
				const promise = parseImage(this.src);
				if (isCrossOriginURL(this.src)) {
					this.imageAttributes.crossOrigin = this.crossOrigin;
				}
				setTimeout(() => {
					promise.then(this.onParseImage);
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
			if (arrayBuffer && orientation && isLocal(source)) {
				this.imageAttributes.src = arrayBufferToDataURL(arrayBuffer);
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
				this.coordinates = this.moveAlgorithm({
					...this.getPublicProperties(),
					positionRestrictions: algorithms.limitBy(this.positionRestrictions, this.visibleArea),
					coordinates: this.coordinates,
					event: this.normalizeEvent(event),
				});
				this.onChange();
			}
		},
		onResize(event) {
			if (!this.transitionsOptions.enabled && (!this.stencilSize || this.autoZoom)) {
				const sizeRestrictions = this.sizeRestrictions;

				// The magic number is the approximation of the handler size
				// Temporary solution that should be improved in the future
				const minimumSize = Math.min(this.coordinates.width, this.coordinates.height, 20 * this.coefficient);

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
			}
		},
		onManipulateImage(event, normalize = true) {
			const { visibleArea, coordinates } = algorithms.manipulateImage({
				...this.getPublicProperties(),
				event: normalize ? this.normalizeEvent(event) : event,
				getAreaRestrictions: this.getAreaRestrictions,
				imageRestriction: this.imageRestriction,
				adjustStencil: !this.stencilSize && this.settings.resizeImage.adjustStencil,
				// Deprecated
				areaRestrictions: this.areaRestrictions,
			});

			this.visibleArea = visibleArea;
			this.coordinates = coordinates;

			this.runAutoZoom('manipulateImage');

			this.onChange();
		},
		onPropsChange() {
			this.coordinates = this.applyTransform(this.coordinates, true);
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
		<div :class="classes.background" :style="boundariesStyle" />
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
				<component
					:is="stencilComponent"
					v-show="imageLoaded"
					ref="stencil"
					:transitions="transitionsOptions"
					:stencil-coordinates="stencilCoordinates"
					:img="{
						src: imageAttributes.src,
						size: {
							width: imageAttributes.width,
							height: imageAttributes.height,
						},
						transforms: imageTransforms,
						coefficient: coefficient,
					}"
					v-bind="stencilProps"
					@resize="onResize"
					@resize-end="onResizeEnd"
					@move="onMove"
					@move-end="onMoveEnd"
				/>
				<canvas ref="canvas" :style="{ display: 'none' }" />
				<canvas ref="sourceCanvas" :style="{ display: 'none' }" />
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
	&__boundaries {
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
