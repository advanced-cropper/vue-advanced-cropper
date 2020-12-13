<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { radians } from '../../core';
import { getStyleTransforms } from '../../core/image';
import { rotateSize } from '../../core/service';

const cn = bem('vue-preview-result');

export default {
	name: 'PreviewResult',
	props: {
		image: {
			type: Object,
		},
		transitions: {
			type: Object,
		},
		stencilCoordinates: {
			type: Object,
			default() {
				return {
					width: 0,
					height: 0,
					left: 0,
					top: 0,
				};
			},
		},
		imageClass: {
			type: String,
		},
		refreshDebounce: {
			type: Number,
			default: 500,
		},
	},
	computed: {
		classes() {
			return {
				root: cn(),
				wrapper: cn('wrapper'),
				imageWrapper: cn('image-wrapper'),
				image: classnames(cn('image'), this.imageClass),
			};
		},
		wrapperStyle() {
			const result = {
				width: `${this.stencilCoordinates.width}px`,
				height: `${this.stencilCoordinates.height}px`,
				left: `calc(50% - ${this.stencilCoordinates.width / 2}px)`,
				top: `calc(50% - ${this.stencilCoordinates.height / 2}px)`,
			};
			if (this.transitions && this.transitions.enabled) {
				result.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
			}
			return result;
		},
		imageStyle() {
			const imageTransforms = this.image.transforms;

			const virtualSize = rotateSize(
				{
					width: this.image.width,
					height: this.image.height,
				},
				imageTransforms.rotate,
			);

			const result = {
				width: `${this.image.width}px`,
				height: `${this.image.height}px`,
				left: `${
					-this.stencilCoordinates.left -
					imageTransforms.translateX +
					(virtualSize.width - this.image.width) / 2
				}px`,
				top: `${
					-this.stencilCoordinates.top -
					imageTransforms.translateY +
					(virtualSize.height - this.image.height) / 2
				}px`,
			};
			result.transform = getStyleTransforms(imageTransforms);

			if (this.transitions && this.transitions.enabled) {
				result.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
			}
			return result;
		},
	},
};
</script>

<template>
	<div :class="classes.root">
		<div ref="wrapper" :class="classes.wrapper" :style="wrapperStyle">
			<img ref="image" :src="image.src" :class="classes.image" :style="imageStyle" />
		</div>
	</div>
</template>

<style lang="scss">
.vue-preview-result {
	overflow: hidden;
	box-sizing: border-box;
	position: absolute;
	height: 100%;
	width: 100%;
	&__wrapper {
		position: absolute;
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
