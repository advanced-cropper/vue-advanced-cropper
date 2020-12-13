<script>
import debounce from 'debounce';
import bem from 'easy-bem';
import classnames from 'classnames';
import { radians, replacedProp } from '../../core';
import { getStyleTransforms } from '../../core/image';
import { getCenter, rotateSize } from '../../core/service';

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
		refreshDebounce: {
			type: Number,
			default: 500,
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
			loaded: false,
			shift: {
				left: 0,
				top: 0,
			},
		};
	},
	computed: {
		classes() {
			return {
				root: classnames(cn(), this.classname),
				wrapper: cn('wrapper'),
				imageWrapper: cn('image-wrapper'),
				image: classnames(cn('image'), this.imageClass || this.imageClassname),
			};
		},
		wrapperStyle() {
			return {
				width: `${this.stencilCoordinates.width}px`,
				height: `${this.stencilCoordinates.height}px`,
			};
		},
		imageWrapperStyle() {
			const imageTransforms = this.img.transforms;
			const coefficient = this.img.coefficient;
			const imageSize = this.img.size;

			const virtualSize = rotateSize(imageSize, imageTransforms.rotate);

			const borderShift = this.shift;

			const imageShift = {
				left:
					-this.stencilCoordinates.left -
					imageTransforms.translateX +
					virtualSize.width / (2 * coefficient) -
					borderShift.left,
				top:
					-this.stencilCoordinates.top -
					imageTransforms.translateY +
					virtualSize.height / (2 * coefficient) -
					borderShift.top,
			};

			const result = {
				width: `${imageSize.width / coefficient}px`,
				height: `${imageSize.height / coefficient}px`,
				left: `${imageShift.left}px`,
				top: `${imageShift.top}px`,
			};

			result.transform = ` translate(-50%, -50%)` + getStyleTransforms(imageTransforms);

			if (this.transitions && this.transitions.enabled) {
				result.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
			}

			return result;
		},
	},
	created() {
		this.debouncedRefresh = debounce(this.refresh, this.refreshDebounce);
		this.$watch('img.coefficient', this.refresh);
	},
	updated() {
		this.debouncedRefresh();
	},
	mounted() {
		this.refresh();
	},
	methods: {
		refresh() {
			const { wrapper } = this.$refs;
			if (wrapper) {
				if (!this.transitions || !this.transitions.enabled) {
					const { width, height } = wrapper.getBoundingClientRect();
					this.shift = {
						left: (this.stencilCoordinates.width - width) / 2,
						top: (this.stencilCoordinates.height - height) / 2,
					};
				}
				this.loaded = Boolean(this.img.coefficient);
			}
		},
	},
};
</script>

<template>
	<div :class="classes.root">
		<div ref="wrapper" :class="classes.wrapper">
			<div v-if="loaded" ref="imageWrapper" :class="classes.imageWrapper" :style="imageWrapperStyle">
				<img ref="image" :src="img.src" :class="classes.image" />
			</div>
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
		width: 100%;
		height: 100%;
	}
	&__image-wrapper {
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
