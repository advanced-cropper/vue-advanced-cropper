<script>

import classnames from 'classnames';
import bem from 'easy-bem';
import Vue from 'vue';
import RectangleStencil from './components/stencils/RectangleStencil.vue'

const cn = bem('vue-advanced-cropper')

export default {
  name: "Cropper",
  props: {
    value: {
      type: Object,
    },
    src: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    canvas: {
      type: Boolean,
      default: true
    },
    defaultCoordinates: {
      type: Function,
      default: function(cropper, image) {
        const width = Math.min(image.naturalWidth, image.naturalHeight) / 2;
        const height = width*1.5;
        const left = image.naturalWidth / 2 - width/2;
        const top = image.naturalHeight / 2 - height/2;
        return {
          width, height, left, top
        }
      }
    },
    imageSize: {
      type: Function,
      default: function(cropper, image) {
          const imageWidth = image.naturalWidth;
          const imageHeight = image.naturalHeight;
          const areaHeight = cropper.clientHeight;
          const areaWidth = cropper.clientWidth;

          let newHeight = areaHeight;
          let newWidth = imageWidth * areaHeight / imageHeight

          if (newWidth > areaWidth) {
            newWidth = areaWidth;
            newHeight = imageHeight * areaWidth / imageWidth;
          }

          return {
            width: newWidth,
            height: newHeight
          }
      }
    },
    minWidth: {
      type: [Number, String],
    },
    minHeight: {
      type: [Number, String],
    },
    aspectRatio: {
      type: [Number, String],
    },
    scaleable: {
      type: Boolean,
      default: true
    },
    scaleX: {
      type: Boolean,
    },
    scaleY: {
      type: Boolean,
    },
    stencilComponent: {
      type: [Object, String],
      default() {
        return RectangleStencil
      },
    },
    stencilProps: {
      type: Object,
      default() {
        return {}
      },
    },
    disableDefaultClasses: {
      type: Boolean,
      default: false
    },
    cropperClass: {
      type: String,
    },
    imageClass: {
      type: String,
    },
    areaClass: {
      type: String,
    },
    stencilWrapperClass: {
      type: String,
    },
  },
  computed: {
    coefficient() {
      return this.imageWidth ? (this.imageWidth / this.$refs.image.naturalWidth) : 0
    },
    classes() {
      return {
        cropper: classnames(!this.disableDefaultClasses && cn(), this.cropperClass),
        image: classnames(!this.disableDefaultClasses && cn('image'), this.imageClass),
        area: classnames(!this.disableDefaultClasses && cn('area'), this.areaClass),
        stencilWrapper: classnames(!this.disableDefaultClasses && cn('stencil-wrapper'), this.stencilWrapperClass)
      }
    },
    stencilCoordinates() {
      const {width, height, left, top} = this.coordinates
      return {
          width: width * this.coefficient,
          height: height * this.coefficient,
          left: left * this.coefficient,
          top: top * this.coefficient
      }
    },
    wrapperStyle() {
      return {
          width: `${this.stencilCoordinates.width}px`,
          height: `${this.stencilCoordinates.height}px`,
          left: `${this.stencilCoordinates.left}px`,
          top: `${this.stencilCoordinates.top}px`
      }
    },
    imageStyle() {
      return {
        width: this.imageWidth ? `${this.imageWidth}px` : 'auto',
        height: this.imageWidth ? `${this.imageHeight}px` : 'auto',
      };
    }
  },
  data() {
    return {
      imageWidth: null,
      imageHeight: null,
      coordinates: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
    }
  },
  methods: {
    onChangeCoordinates(newCoordinates) {
      //console.log("MOVE", newCoordinates, this.coordinates)
      const stencil = this.$refs.stencil
      const processedCoordinates = this.processCoordinates(newCoordinates)
      this.coordinates = processedCoordinates
      this.$emit('change', {
        coordinates: {
          ...processedCoordinates
        },
        // canvas: stencil.canvas(),
        // params: stencil.params()
      })
    },
    onChangeImage() {
      const image = this.$refs.image
      if (image.complete) {
          this.refreshImage().then(this.resetCoordinates)
      } else {
        image.addEventListener('load', () => {
          this.refreshImage().then(this.resetCoordinates);
        })
      }
    },
    processCoordinates(receivedCoordinates) {

      const newCoordinates = {
        ...receivedCoordinates
      }
      const changeWidth = newCoordinates.width - this.coordinates.width
      const changeHeight = newCoordinates.height - this.coordinates.height

      if (newCoordinates.left < 0) {
        if (changeWidth > 0) {
          // Undoing width change
          newCoordinates.width = Math.max(this.coordinates.width, newCoordinates.width + newCoordinates.left)
        }
        newCoordinates.left = 0
      }
      if (newCoordinates.left + newCoordinates.width > this.imageWidth / this.coefficient) {
        if (changeWidth > 0) {
          const gap = newCoordinates.left + newCoordinates.width - this.imageWidth / this.coefficient
          // Undoing width change
          newCoordinates.width = Math.max(this.coordinates.width, newCoordinates.width - gap)
        }
        newCoordinates.left = Math.max(0, this.imageWidth / this.coefficient - newCoordinates.width)
      }

      if (newCoordinates.top < 0) {
        if (changeHeight > 0) {
          // Undoing width change
          newCoordinates.height = Math.max(this.coordinates.height, newCoordinates.height + newCoordinates.top)
        }
        newCoordinates.top = 0
      }
      if (newCoordinates.top + newCoordinates.height > this.imageHeight / this.coefficient) {
        if (changeHeight > 0) {
          const gap = newCoordinates.top + newCoordinates.height - this.imageHeight / this.coefficient
          // Undoing width change
          newCoordinates.height = Math.max(this.coordinates.height, newCoordinates.height - gap)
        }
        newCoordinates.top = Math.max(0, this.imageHeight / this.coefficient - newCoordinates.height)
      }

      return newCoordinates
    },
    resetCoordinates() {
      this.onChangeCoordinates(this.defaultCoordinates(this.$refs.cropper, this.$refs.image));
    },
    refreshImage() {
      return new Promise((resolve) => {
        const image = this.$refs.image
        const cropper = this.$refs.cropper

        this.imageWidth = null;
        this.imageHeight = null;

        this.areaWidth = cropper.clientWidth
        this.areaHeight = cropper.clientHeight

        Vue.nextTick(() => {
          const {height, width} = this.imageSize(cropper, image)
          if (height) {
            this.imageHeight = height
          }
          if (width) {
            this.imageWidth = width
          }
          resolve();
        })
      })
      
    }
  },
  mounted() {
    this.onChangeImage();
  },
  created() {
		window.addEventListener("resize", this.refreshImage, false);
		window.addEventListener("orientationchange", this.refreshImage, false);
	},
	destroyed () {
		window.removeEventListener("resize", this.refreshImage);
		window.removeEventListener("orientationchange", this.refreshImage);
	},
};
</script>

<template>
  <div :class="classes.cropper" ref="cropper">
    <img :src="src" :class="classes.image" :style="imageStyle" ref="image"/>
    <div :class="classes.area" :style="imageStyle">
      <div :class="classes.stencilWrapper" :style="wrapperStyle">
        <component 
          :is="stencilComponent" 
          :img="src"
          :left="coordinates.left"
          :top="coordinates.top"
          :width="coordinates.width"
          :height="coordinates.height"
          :stencil-width="stencilCoordinates.width"
          :stencil-height="stencilCoordinates.height"
          @change="onChangeCoordinates"
        />
      </div>
    </div>
    
  </div>
</template>

<style lang="scss">
  .vue-advanced-cropper {
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    &__image {
      opacity: 0.5;
      display: inline-block;
    }
    &__area {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    &__stencil-wrapper {
      position: absolute;
    }
  }
</style>