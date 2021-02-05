<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { radians } from '../../core';
import { getStyleTransforms } from '../../core/image';
import { rotateSize } from '../../core/service';
const cn = bem('vue-preview');
export default {
	props: {
		coordinates: {
			type: Object,
		},
		transitions: {
			type: Object,
		},
		image: {
			type: Object,
			default() {
				return {};
			},
		},
		imageClass: {
			type: String,
		},
		width: {
			type: Number,
		},
		height: {
			type: Number,
		},
		fill: {
			type: Boolean,
		},
	},
	data() {
		return {
			calculatedImageSize: {
				width: 0,
				height: 0,
			},
			calculatedSize: {
				width: 0,
				height: 0,
			},
		};
	},
	computed: {
		classes() {
			return {
				root: cn({ fill: this.fill }),
				wrapper: cn('wrapper'),
				imageWrapper: cn('image-wrapper'),
				image: classnames(cn('image'), this.imageClass),
			};
		},
		style() {
			if (!this.fill) {
				const result = {};
				if (this.width) {
					result.width = `${this.size.width}px`;
				}
				if (this.height) {
					result.height = `${this.size.height}px`;
				}
				if (this.transitions && this.transitions.enabled) {
					result.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
				}
				return result;
			} else {
				return {};
			}
		},
		wrapperStyle() {
			const result = {
				width: `${this.size.width}px`,
				height: `${this.size.height}px`,
				left: `calc(50% - ${this.size.width / 2}px)`,
				top: `calc(50% - ${this.size.height / 2}px)`,
			};
			if (this.transitions && this.transitions.enabled) {
				result.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
			}
			return result;
		},
		imageStyle() {
			if (this.coordinates && this.image) {
				const coefficient = this.coordinates.width / this.size.width;
				const transforms = {
					rotate: 0,
					flip: {
						horizontal: false,
						vertical: false,
					},
					...this.image.transforms,
					scaleX: 1 / coefficient,
					scaleY: 1 / coefficient,
				};
				const width = this.imageSize.width;
				const height = this.imageSize.height;
				const virtualSize = rotateSize(
					{
						width,
						height,
					},
					transforms.rotate,
				);
				const result = {
					width: `${width}px`,
					height: `${height}px`,
					left: '0px',
					top: '0px',
				};
				const compensations = {
					rotate: {
						left: ((width - virtualSize.width) * transforms.scaleX) / 2,
						top: ((height - virtualSize.height) * transforms.scaleY) / 2,
					},
					scale: {
						left: ((1 - transforms.scaleX) * width) / 2,
						top: ((1 - transforms.scaleY) * height) / 2,
					},
				};
				result.transform =
					`translate(
				${-this.coordinates.left / coefficient - compensations.rotate.left - compensations.scale.left}px,${
						-this.coordinates.top / coefficient - compensations.rotate.top - compensations.scale.top
					}px) ` + getStyleTransforms(transforms);
				if (this.transitions && this.transitions.enabled) {
					result.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
				}
				return result;
			} else {
				return {};
			}
		},
		size() {
			return {
				width: this.width || this.calculatedSize.width,
				height: this.height || this.calculatedSize.height,
			};
		},
		imageSize() {
			return {
				width: this.image.width || this.calculatedImageSize.width,
				height: this.image.height || this.calculatedImageSize.height,
			};
		},
	},
	watch: {
		image(value) {
			if (value.width || value.height) {
				this.onChangeImage();
			}
		},
	},
	mounted() {
		this.onChangeImage();
		this.$refs.image.addEventListener('load', () => {
			this.refreshImage();
		});
		window.addEventListener('resize', this.refresh);
		window.addEventListener('orientationchange', this.refresh);
	},
	destroyed() {
		window.removeEventListener('resize', this.refresh);
		window.removeEventListener('orientationchange', this.refresh);
	},
	methods: {
		refreshImage() {
			const image = this.$refs.image;
			this.calculatedImageSize.height = image.naturalHeight;
			this.calculatedImageSize.width = image.naturalWidth;
		},
		refresh() {
			const root = this.$refs.root;
			if (!this.width) {
				this.calculatedSize.width = root.clientWidth;
			}
			if (!this.height) {
				this.calculatedSize.height = root.clientHeight;
			}
		},
		onChangeImage() {
			const image = this.$refs.image;
			if (image && image.complete) {
				this.refreshImage();
			}
			this.refresh();
		},
	},
};
</script>

<template>
	<div ref="root" :class="classes.root" :style="style">
		<div ref="wrapper" :class="classes.wrapper" :style="wrapperStyle">
			<img
				v-show="image && image.src"
				ref="image"
				:src="image && image.src"
				:class="classes.image"
				:style="imageStyle"
			/>
		</div>
	</div>
</template>

<style lang="scss">
.vue-preview {
	overflow: hidden;
	box-sizing: border-box;
	position: relative;
	&--fill {
		width: 100%;
		height: 100%;
		position: absolute;
	}
	&__wrapper {
		position: absolute;
		height: 100%;
		width: 100%;
	}
	&__image {
		pointer-events: none;
		position: absolute;
		user-select: none;
		transform-origin: center;
		// Workaround to prevent bugs at the websites with max-width
		// rule applied to img (Vuepress for example)
		max-width: none !important;
	}
}
</style>
