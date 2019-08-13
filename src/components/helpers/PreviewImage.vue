<script>
import classnames from 'classnames';
import bem from 'easy-bem';

const cn = bem('vue-preview-image');

export default {
	name: 'PreviewImage',
	props: {
		img: {
			type: String,
		},
		classname: {
			type: String,
		},
		imageClassname: {
			type: String,
		},
		width: {
			type: Number,
		},
		height: {
			type: Number,
		},
		top: {
			type: Number,
		},
		left: {
			type: Number,
		},
		previewWidth: {
			type: Number,
			required: true,
		},
		previewHeight: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			imageSize: {
				width: 0,
				height: 0,
			},
		};
	},
	computed: {
		classnames() {
			return {
				default: classnames(cn(), this.classname),
				image: classnames(cn('image'), this.imageClassname),
			};
		},
		wrapperStyle() {
			return {
				width: `${this.previewWidth}px`,
				height: `${this.previewHeight}px`,
			};
		},
		imageStyle() {
			const coefficient = this.previewHeight / this.height;
			const height = this.imageSize.height * coefficient;
			const width = this.imageSize.width * coefficient;
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${-this.left*coefficient}px`,
				top: `${-this.top*coefficient}px`,
			};
		},
	},
	watch: {
		img() {
			this.onChangeImage();
		},
	},
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

};
</script>

<template>
  <div
    :class="classnames.default"
    :style="wrapperStyle"
  >
    <img
      ref="image"
      :src="img"
      :class="classnames.image"
      :style="imageStyle"
    >
  </div>
</template>

<style lang="scss">
  .vue-preview-image{
    overflow: hidden;
	position: relative;
    &__image {
		pointer-events: none;
		position: absolute;
		// Workaround to prevent bugs at the websites with max-width
		// rule applied to img (Vuepress for example)
		max-width: unset !important;
    }
  }
</style>
