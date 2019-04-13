<script>
import classnames from 'classnames';
import bem from 'easy-bem';

const cn = bem('vue-preview-image')

export default {
  name: "PreviewImage",
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
			required: true
		},
		previewHeight: {
			type: Number,
			required: true
		}
  },
  computed: {
    classnames() {
      return {
        default: classnames(!this.disableDefaultClasses && cn(), this.classname),
        image: classnames(!this.disableDefaultClasses && cn('image'), this.imageClassname)
      }
		},
		wrapperStyle() {
			return {
				width: `${this.previewWidth}px`,
				height: `${this.previewHeight}px`,
			}
		},
		imageStyle() {
			const image = this.$refs.image;
			const coefficient = this.previewHeight / this.height;
			const height = image ? image.naturalHeight * coefficient : 0
			const width = image ? image.naturalWidth * coefficient : 0
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${-this.left*coefficient}px`,
				top: `${-this.top*coefficient}px`
			}
    }
  },
};
</script>

<template>
  <div :class="classnames.default" :style="wrapperStyle">
    <img :src="img" :class="classnames.image" :style="imageStyle" ref="image"/> 
  </div>
</template>

<style lang="scss">
  .vue-preview-image{
    overflow: hidden;
		position: relative;
    &__image {
      position: absolute;
    }
  }
</style>