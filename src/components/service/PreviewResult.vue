<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { replacedProp } from '../../core';
import { getStyleTransforms } from '../../core/image';
import { getCenter } from '../../core/service';

const cn = bem('vue-preview-result');

export default {
	name: 'PreviewResult',
	props: {
		img: {
			type: Object,
		},
		transitions: {
			type: Boolean,
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
	data() {
		return {
			shift: {
				width: 0,
				height: 0,
			},
		};
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
			return {
				width: `${this.stencilCoordinates.width}px`,
				height: `${this.stencilCoordinates.height}px`,
			};
		},
		imageStyle() {
			const imageTransforms = this.img.transforms;
			const flipped = imageTransforms.flipped;
			const coefficient = this.img.coefficient;
			const height = this.img.size.height / coefficient;
			const width = this.img.size.width / coefficient;

			const result = {
				width: `${width}px`,
				height: `${height}px`,
			};

			if (flipped) {
				result.width = `${height}px`;
				result.height = `${width}px`;
				result.left = `${-this.stencilCoordinates.left - imageTransforms.translateX - (height - width) / 2}px`;
				result.top = `${-this.stencilCoordinates.top - imageTransforms.translateY - (width - height) / 2}px`;
			} else {
				result.left = `${-this.stencilCoordinates.left - imageTransforms.translateX}px`;
				result.top = `${-this.stencilCoordinates.top - imageTransforms.translateY}px`;
			}

			result.transform =
				getStyleTransforms(imageTransforms) + ` translate(-${this.shift.width}px, -${this.shift.height}px)`;

			return result;
		},
	},
	updated() {
		const { wrapper } = this.$refs;
		if (wrapper && !this.transitions) {
			this.shift.width = (this.stencilCoordinates.width - wrapper.clientWidth) / 2;
			this.shift.height = (this.stencilCoordinates.height - wrapper.clientHeight) / 2;
		}
	},
};
</script>

<template>
	<div ref="wrapper" :class="classes.root">
		<div ref="imageWrapper" :class="classes.wrapper" :style="imageStyle">
			<img ref="image" :src="img.src" :class="classes.image" />
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
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		position: absolute;
		user-select: none;
		transform-origin: center;
		// Workaround to prevent bugs at the websites with max-width
		// rule applied to img (Vuepress for example)
		max-width: unset !important;
	}
}
</style>
