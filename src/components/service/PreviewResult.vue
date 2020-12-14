<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { replacedProp } from '../../core';
import { getStyleTransforms } from '../../core/image';
import { rotateSize } from '../../core/service';

const cn = bem('vue-preview-result');

export default {
	name: 'PreviewResult',
	props: {
		img: {
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
		// Deprecated props
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
	},
	computed: {
		classes() {
			return {
				root: classnames(cn(), this.classname),
				image: classnames(cn('image'), this.imageClass || this.imageClassname),
				wrapper: cn('wrapper'),
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
			const imageTransforms = this.img.transforms;
			const flipped = imageTransforms.flipped;
			const coefficient = this.img.coefficient;
			const height = this.img.size.height / coefficient;
			const width = this.img.size.width / coefficient;

			const virtualSize = rotateSize(this.img.size, imageTransforms.rotate);

			const result = {
				width: `${this.img.size.width / coefficient}px`,
				height: `${this.img.size.height / coefficient}px`,
				left: `${
					-this.stencilCoordinates.left -
					imageTransforms.translateX +
					(virtualSize.width - this.img.size.width) / (2 * coefficient)
				}px`,
				top: `${
					-this.stencilCoordinates.top -
					imageTransforms.translateY +
					(virtualSize.height - this.img.size.height) / (2 * coefficient)
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
			<img ref="image" :src="img.src" :class="classes.image" :style="imageStyle" />
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
