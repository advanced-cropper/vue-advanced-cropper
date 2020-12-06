<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { isLoadedImage, replacedProp } from '../../core';
import { updateCanvas } from '../../core/canvas';
import { getStyleTransforms, prepareSource } from '../../core/image';

const cn = bem('vue-canvas-preview-result');

export default {
	props: {
		img: {
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
		resultCoordinates: {
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
	},
	data() {
		return {
			imageLoaded: false,
		};
	},
	computed: {
		classes() {
			return {
				root: classnames(cn(), this.classname),
				image: cn('image'),
				wrapper: cn('wrapper'),
			};
		},
		canvasStyle() {
			return {
				width: `${this.stencilCoordinates.width}px`,
				height: `${this.stencilCoordinates.height}px`,
			};
		},
	},
	mounted() {
		this.$refs.image.addEventListener('load', this.drawImage);

		['src', 'resultCoordinates'].forEach((property) => {
			this.$watch(property, this.drawImage, {
				deep: true,
				immediate: true,
			});
		});
	},
	methods: {
		drawImage() {
			const image = this.$refs.image;

			if (image && isLoadedImage(image)) {
				const canvas = this.$refs.canvas;
				const source = prepareSource(this.$refs.sourceCanvas, image, this.img.transforms);
				updateCanvas(canvas, image, this.resultCoordinates, this.stencilCoordinates);
			}
		},
	},
};
</script>

<template>
	<div :class="classes.root">
		<div ref="wrapper">
			<canvas ref="canvas" :style="canvasStyle" />
			<canvas ref="sourceCanvas" :style="{ display: 'none' }" />
			<img crossorigin="anonymous" ref="image" :class="classes.image" :src="img.src" />
		</div>
	</div>
</template>

<style lang="scss">
.vue-canvas-preview-result {
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
		max-width: unset !important;
	}
}
</style>
