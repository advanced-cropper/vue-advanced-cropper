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
			required: true,
		},
		height: {
			type: Number,
			required: true,
		},
		fill: {
			type: Boolean,
		},
	},
	data() {
		return {
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
				const result = {
					width: `${this.width}px`,
					height: `${this.height}px`,
				};
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
				width: `${this.width}px`,
				height: `${this.height}px`,
				left: `calc(50% - ${this.width / 2}px)`,
				top: `calc(50% - ${this.height / 2}px)`,
			};
			if (this.transitions && this.transitions.enabled) {
				result.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
			}
			return result;
		},
		imageStyle() {
			if (this.coordinates && this.image) {
				const width = this.image.width || this.calculatedSize.width;
				const height = this.image.height || this.calculatedSize.height;

				const optimalImageSize =
					width > height
						? {
								width: Math.min(1024, width),
								height: Math.min(1024, width) / (width / height),
						  }
						: {
								height: Math.min(1024, height),
								width: Math.min(1024, height) * (width / height),
						  };

				const coefficient = this.coordinates.width / this.width;

				const transforms = {
					rotate: 0,
					flip: {
						horizontal: false,
						vertical: false,
					},
					...this.image.transforms,
					scaleX: (1 / coefficient) * (width / optimalImageSize.width),
					scaleY: (1 / coefficient) * (width / optimalImageSize.width),
				};

				const virtualSize = rotateSize(
					{
						width: optimalImageSize.width,
						height: optimalImageSize.height,
					},
					transforms.rotate,
				);

				const result = {
					width: `${optimalImageSize.width}px`,
					height: `${optimalImageSize.height}px`,
					left: '0px',
					top: '0px',
				};

				const compensations = {
					rotate: {
						left: ((optimalImageSize.width - virtualSize.width) * transforms.scaleX) / 2,
						top: ((optimalImageSize.height - virtualSize.height) * transforms.scaleY) / 2,
					},
					scale: {
						left: ((1 - transforms.scaleX) * optimalImageSize.width) / 2,
						top: ((1 - transforms.scaleY) * optimalImageSize.height) / 2,
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
	},
	methods: {
		refreshImage() {
			const image = this.$refs.image;
			this.calculatedSize.height = image.naturalHeight;
			this.calculatedSize.width = image.naturalWidth;
		},
		onChangeImage() {
			const image = this.$refs.image;
			if (image && image.complete) {
				this.refreshImage();
			}
		},
	},
};
</script>

<template>
	<div :class="classes.root" :style="style">
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
