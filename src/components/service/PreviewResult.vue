<script>
import classnames from 'classnames';
import Vue from 'vue';
import bem from 'easy-bem';

const cn = bem('vue-preview-result')

export default {
	name: 'PreviewResult',
	props: {
		img: {
			type: String
		},
		classname: {
			type: String,
		},
		imageClassname: {
			type: String,
		},
		resultCoordinates: {
			type: Object,
			default() {
				return {
					width: 0,
					height: 0,
					left: 0,
					top: 0
				}
			}
		},
		stencilCoordinates: {
			type: Object,
			default() {
				return {
					width: 0,
					height: 0,
					left: 0,
					top: 0
				}
			}
		},
	},
	data() {
		return {
			imageSize: {
				width: 0,
				height: 0
			}
		}
	},
	inject: ['getArea', 'getStencil'],
	mounted() {
		this.onChangeImage();
	},
	methods: {
		refreshImage() {
			const image = this.$refs.image;
			this.imageSize.height = image.naturalHeight;
			this.imageSize.width = image.naturalWidth;
		},
		onChangeImage() {
			const image = this.$refs.image;
			if (image.complete) {
				this.refreshImage();
			} else {
				image.addEventListener('load', () => {
					this.refreshImage();
				});
			}
		},
	},
	watch: {
		img() {
			Vue.nextTick(() => {
				this.onChangeImage();
			})
		}
	},
	computed: {
		classnames() {
			return {
				default: classnames(cn(), this.classname),
				image: classnames(cn('image'), this.imageClassname),
				wrapper: cn('wrapper')
			}
		},
		wrapperStyle() {
			return {
				width: `${this.stencilCoordinates.width}px`,
				height: `${this.stencilCoordinates.height}px`,
				left: `calc(50% - ${this.stencilCoordinates.width/2}px)`,
				top: `calc(50% - ${this.stencilCoordinates.height/2}px)`,
			}
		},
		imageStyle() {
			const coefficient = this.stencilCoordinates.height / this.resultCoordinates.height;
			const height = this.imageSize.height * coefficient
			const width = this.imageSize.width * coefficient
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${-this.stencilCoordinates.left}px`,
				top: `${-this.stencilCoordinates.top}px`
			}
		}
	},
};
</script>

<template>
  <div
    :class="classnames.default"
  >
	<div ref="wrapper" :class="classnames.wrapper" :style="wrapperStyle">
		<img
			ref="image"
			:src="img"
			:class="classnames.image"
			:style="imageStyle"
		>
	</div>
  </div>
</template>

<style lang="scss">
.vue-preview-result{
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
	// Workaround to prevent bugs at the websites with max-width
	// rule applited to img (Vuepress for example)
	max-width: unset !important;
  }
}
</style>
