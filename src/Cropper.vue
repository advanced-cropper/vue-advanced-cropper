<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import Vue from 'vue';
import debounce from 'debounce';
import { RectangleStencil } from './components/stencils';
import { CropperWrapper } from './components/service';
import { ResizeEvent, MoveEvent } from './core/events';
import { isLocal, isCrossOriginURL, isUndefined, addTimestamp, getSettings, parseNumber } from './core/utils';
import { arrayBufferToDataURL, getImageTransforms, getStyleTransforms, prepareSource, parseImage } from './core/image';
import { ALL_DIRECTIONS, MINIMAL_PERCENT_SIZE, IMAGE_RESTRICTIONS, DEFAULT_COORDINATES } from './core/constants';
import * as algorithms from './core/algorithms';

const cn = bem('vue-advanced-cropper');

function migrateAlgorithm(f, name, transform) {
	function fallback(params) {
		console.warn(`The arguments will be passed to the prop '${name}' as an single object {${Object.keys(params).join(',')}} in the future releases. You should change the interface of your function.`);
		return f(...transform(params));
	}
	return (params) => {
		if (f.length > 1) {
			return fallback(params);
		} else {
			try {
				return f(params);
			} catch (e) {
				return fallback(params);
			}
		}
	};
}

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
		bustCache: {
			type: Boolean,
			default: false,
		},
		allowedArea: {
			type: Function,
			default: algorithms.allowedArea,
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
			boundarySize: {
				width: null,
				height: null,
			},
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
			coordinates: {
				...DEFAULT_COORDINATES
			},
			stencilCoordinates: {
				...DEFAULT_COORDINATES
			},
			frozenDirections: {
				width: false,
				height: false,
			},
			worldTransforms: {
				scale: 1,
				shift: {
					left: 0,
					top: 0
				}
			}
		};
	},
	computed: {
		settings() {
			const settings = {
				touchResize: getSettings(this.touchResize),
				touchMove: getSettings(this.touchMove),
				mouseMove: getSettings(this.mouseMove),
				wheelResize: getSettings(this.wheelResize, {
					ratio: 0.1
				}),
			};

			// Disable some interactions for user convenience
			settings.touchMove.enabled = settings.touchMove.enabled && (this.worldTransforms.scale !== 1 || this.imageRestriction !== 'area');

			return settings;
		},
		imageTransforms() {
			return {
				...this.basicImageTransforms,
				scaleX: (this.basicImageTransforms.scaleX || 1) * this.worldTransforms.scale,
				scaleY: (this.basicImageTransforms.scaleY || 1) * this.worldTransforms.scale,
				translateX: this.worldTransforms.shift.left / this.coefficient + (this.imageSize.width * this.worldTransforms.scale - this.imageSize.width)/2/this.coefficient,
				translateY: this.worldTransforms.shift.top / this.coefficient + (this.imageSize.height * this.worldTransforms.scale - this.imageSize.height)/2/this.coefficient,
			};
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
				width: this.boundarySize.width
					? `${this.boundarySize.width}px`
					: 'auto',
				height: this.boundarySize.height
					? `${this.boundarySize.height}px`
					: 'auto',
				opacity: this.imageLoaded ? 1 : 0,
				transition: `opacity ${this.transitionTime}ms`,
				pointerEvents: this.imageLoaded ? 'all' : 'none',
			};
		},
		imageStyle() {
			const result = {
				left: `calc(50% + ${this.imageTransforms.translateX}px)`,
				top: `calc(50% + ${this.imageTransforms.translateY}px)`,
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
			const minSize = Math.max(
				MINIMAL_PERCENT_SIZE * this.imageSize.width / this.coefficient / this.worldTransforms.scale,
				MINIMAL_PERCENT_SIZE * this.imageSize.height / this.coefficient / this.worldTransforms.scale,
			);
						
			const oldRestrictions = {
				minWidth: !isUndefined(this.minWidth) ? this.minWidth : 0,
				minHeight: !isUndefined(this.minHeight) ? this.minHeight : 0,
				maxWidth: !isUndefined(this.maxWidth) ? this.maxWidth : Infinity,
				maxHeight: !isUndefined(this.maxHeight) ? this.maxHeight : Infinity,
			};

			const restrictions = migrateAlgorithm(this.restrictions, 'restrictions', (args) => [
				args.minWidth, args.minHeight, args.maxWidth, args.maxHeight, args.imageWidth, args.imageHeight
			])({
				minWidth: parseNumber(oldRestrictions.minWidth),
				minHeight: parseNumber(oldRestrictions.minHeight),
				maxWidth: parseNumber(oldRestrictions.maxWidth),
				maxHeight: parseNumber(oldRestrictions.maxHeight),
				imageWidth: this.imageSize.width,
				imageHeight: this.imageSize.height,
				props: this.$props
			});

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
				if (!restrictions.maxWidth || (restrictions.maxWidth > this.imageSize.width)) {
					restrictions.maxWidth = this.imageSize.width;
				}
				if (!restrictions.maxHeight || (restrictions.maxHeight > this.imageSize.height)) {
					restrictions.maxHeight = this.imageSize.height;
				}
			}

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
		window.addEventListener('resize', this.onResizeWindow);
		window.addEventListener('orientationchange', this.onResizeWindow);
		this.$refs.image.addEventListener('load', () => {
			this.onSuccessLoadImage();
		});
		this.$refs.image.addEventListener('error', () => {
			this.onFailLoadImage();
		});
		this.onChangeImage();
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
		// Internal methods
		prepareResult(coordinates) {
			if (this.roundResult) {
				return algorithms.roundCoordinates({
					coordinates,
					restrictions: this.restrictions,
					allowedArea: this.getAllowedArea()
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
			const { worldTransforms, stencilCoordinates } = algorithms.autoZoom({
				coordinates,
				stencilCoordinates: this.stencilCoordinates,
				worldTransforms: this.worldTransforms,
				coefficient: this.coefficient,
				imageSize: this.imageSize,
				allowedArea: this.getAllowedArea(true)
			});

			this.worldTransforms = worldTransforms;
			this.stencilCoordinates = stencilCoordinates;
		},
		updateStencilCoordinates(coordinates) {
			const { width, height, left, top, } = coordinates;
			this.stencilCoordinates =  {
				width: this.worldTransforms.scale * width / this.coefficient,
				height: this.worldTransforms.scale * height / this.coefficient,
				left: (left * this.worldTransforms.scale + this.worldTransforms.shift.left) / this.coefficient,
				top: (top * this.worldTransforms.scale + this.worldTransforms.shift.top) / this.coefficient,
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
		onResizeWindow() {
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
				if (debounce) {
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
					const src = this.bustCache ? addTimestamp(this.src) : this.src;
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
				resizeEvent.directions[direction] /= this.worldTransforms.scale / this.coefficient;
			});
			this.onChangeCoordinates(
				this.resizeAlgorithm({
					coordinates: this.coordinates,
					restrictions: this.stencilRestrictions,
					allowedArea: this.getAllowedArea(),
					aspectRatio: this.stencilAspectRatios(),
					resizeEvent
				})
			);
			this.updateStencilCoordinates(this.coordinates);
		},
		onManipulateImage(manipulateImageEvent) {
			if (manipulateImageEvent.move.left) {
				manipulateImageEvent.move.left *= this.coefficient;
			}
			if (manipulateImageEvent.move.top) {
				manipulateImageEvent.move.top *= this.coefficient;
			}
			const { worldTransforms, coordinates } = algorithms.manipulateImage({
				manipulateImageEvent,
				coordinates: this.coordinates,
				coefficient: this.coefficient,
				stencilRestrictions: this.stencilRestrictions,
				imageSize: this.imageSize,
				frozenDirections: this.frozenDirections,
				stencilCoordinates: this.stencilCoordinates,
				worldTransforms: this.worldTransforms,
				allowedArea: this.getAllowedArea(true),
				minScale: this.imageRestriction === 'none' ? MINIMAL_PERCENT_SIZE : 1,
				fitImage: this.imageRestriction === 'area'
			});
			this.worldTransforms = worldTransforms;
			this.onChangeCoordinates(coordinates);
			this.updateStencilCoordinates(coordinates);
		},
		onMove(moveEvent) {
			ALL_DIRECTIONS.forEach(direction => {
				moveEvent.directions[direction] /= this.worldTransforms.scale / this.coefficient;
			});
			this.onChangeCoordinates(
				this.moveAlgorithm({
					coordinates: this.coordinates,
					allowedArea: this.getAllowedArea(),
					moveEvent
				})
			);
			this.updateStencilCoordinates(this.coordinates);
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
						minimum: aspectRatio.minimum ? Math.max(minWidth, minHeight * aspectRatio.minimum) : minWidth,
					}
				};
				if (ranges.width.maximum >= ranges.width.minimum) {
					coordinates.width = minWidth;
					coordinates.height = ranges.width.minimum;
				} else if (ranges.height.maximum >= ranges.height.minimum) {
					coordinates.height = minHeight;
					coordinates.width = ranges.height.minimum;
				} else {
					throw 'Error: current aspect ratio is incompatible with minimum/maximum height and width settings. Can\'t setup default coordinates';
				}
			}

			coordinates.left = imageSize.width / 2 - coordinates.width / 2;
			coordinates.top = imageSize.height / 2 - coordinates.height / 2;

			return coordinates;
		},
		setCoordinates(transforms, params = {}) {
			const { autoZoom = true } = params;
			Vue.nextTick(() => {
				if (!this.imageLoaded) {
					this.delayedTransforms = transforms;
					return;
				}
				this.applyTransforms(transforms, autoZoom);
			});
		},
		onPropsChange() {
			this.applyTransforms(this.coordinates, true);
		},
		applyTransforms(transforms, autoZoom = false) {
			const aspectRatio = this.stencilAspectRatios();

			const allowedArea = this.getAllowedArea(true);

			const moveAlgorithm = (prevCoordinates, newCoordinates) => {
				return this.moveAlgorithm({
					coordinates: prevCoordinates,
					allowedArea,
					moveEvent: new MoveEvent(null, {
						left: (newCoordinates.left - prevCoordinates.left),
						top: (newCoordinates.top - prevCoordinates.top),
					})
				});
			};

			const resizeAlgorithm = (prevCoordinates, newCoordinates) => {
				let coordinates = this.defaultCoordinates();
				coordinates = this.resizeAlgorithm({
					coordinates,
					restrictions: this.stencilRestrictions,
					allowedArea,
					aspectRatio,
					resizeEvent: new ResizeEvent(
						null,
						{
							left: (newCoordinates.width - coordinates.width) / 2,
							right: (newCoordinates.width - coordinates.width) / 2,
							top: (newCoordinates.height - coordinates.height) / 2,
							bottom: (newCoordinates.height - coordinates.height) / 2,
						}
					)
				});
				return moveAlgorithm(coordinates, { left: prevCoordinates.left, top: prevCoordinates.top });
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
				if (this.worldTransforms.scale > 1) {
					this.resetWorldTransforms();
				}
				this.updateStencilCoordinates(coordinates);
			}
			this.onChangeCoordinates(coordinates, false);

			return coordinates;
		},
		resetWorldTransforms() {
			this.worldTransforms = {
				scale: 1,
				shift: {
					left:0,
					top: 0
				}
			};
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

			const defaultSize = migrateAlgorithm(this.defaultSize, 'defaultSize', (args) => (
				[args.cropper, args.image, { minWidth: args.minWidth, minHeight: args.minHeight, maxWidth: args.maxWidth, maxHeight: args.maxHeight }, args.imageWidth, args.imageHeight, args.props ]
			))({
				cropper,
				image,
				imageWidth: this.imageSize.width,
				imageHeight: this.imageSize.height,
				props: this.$props,
				aspectRatio: this.stencilAspectRatios(),
				...this.stencilRestrictions,
			});

			if (defaultSize.width < minWidth || defaultSize.height < minHeight || defaultSize.width > maxWidth || defaultSize.height > maxHeight) {
				console.warn('Warning: the default size breaks size restrictions. Check your defaultSize function', defaultSize, this.stencilRestrictions);
			}

			const transforms = [
				defaultSize,
				(coordinates) => ({
					...migrateAlgorithm(this.defaultPosition, 'defaultPosition', (args) => (
						[args.cropper, args.image, args.stencilWidth, args.stencilHeight, args.imageWidth, args.imageHeight, args.props]
					))({
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
			this.resetWorldTransforms();
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
				this.boundarySize = {
					width: 0,
					height: 0,
				};
				this.updateStencilCoordinates({ ...DEFAULT_COORDINATES });
			}, this.transitionTime);
		},
		refreshImage() {
			return new Promise((resolve, reject) => {
				const image = this.$refs.image;
				const cropper = this.$refs.cropper;
				if (this.src && image) {
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

					Vue.nextTick(() => {
						const { height, width, } = migrateAlgorithm(this.areaSize, 'areaSize', (args) => ([
							args.cropper, args.image, args.imageWidth, args.imageHeight
						]))({
							cropper,
							image,
							imageWidth: this.imageSize.width,
							imageHeight: this.imageSize.height
						});
						if (height) {
							this.boundarySize.height = height;
						}
						if (width) {
							this.boundarySize.width = width;
						}
						resolve();
					});
				} else {
					reject();
				}
			});
		},
		getAllowedArea(breakBoundaries) {
			return this.allowedArea({
				breakBoundaries,
				imageSize: this.imageSize,
				worldTransforms: this.worldTransforms,
				imageRestriction: this.imageRestriction
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
      <CropperWrapper
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
            :crossOrigin="imageAttributes.crossOrigin"
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
      </CropperWrapper>
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
