<script>
import classnames from 'classnames'
import bem from 'easy-bem'
import Vue from 'vue'
import debounce from 'debounce'

import { RectangleStencil } from './components/stencils'
import { ResizeEvent, MoveEvent } from './utils/events'

import {
  resize, move
} from './utils/core'

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
    resizeAlgorithm: {
      type: Function,
      default: resize
    },
    moveAlgorithm: {
      type: Function,
      default: move
    },
    defaultSize: {
      type: Function,
      default: function(cropper, image, props) {
        const maxWidth = props.maxWidth / 100 * image.naturalWidth
        const maxHeight = props.maxHeight / 100 * image.naturalHeight
        const minWidth = props.minWidth / 100 * image.naturalWidth
        const minHeight = props.minHeight / 100 * image.naturalHeight

        let newHeight, newWidth
        if (maxHeight > maxWidth) {
          newHeight = Math.max(minHeight, maxHeight * 0.8)
          newWidth = Math.max(minWidth, maxWidth * 0.8)
        }
        else {
          newWidth = Math.max(minWidth, maxWidth * 0.8)
          newHeight = Math.max(minHeight, maxHeight * 0.8)
        }
        return {
          height: newHeight,
          width: newWidth
        }
      }
    },
    defaultPosition: {
      type: Function,
      default: function(cropper, image, width, height, props) {
        return {
          left: image.naturalWidth / 2 - width / 2,
          top: image.naturalHeight / 2 - height / 2,
        }
      }
    },
    areaSize: {
      type: Function,
      default: function(cropper, image) {
          const imageWidth = image.naturalWidth;
          const imageHeight = image.naturalHeight;
          const areaHeight = cropper.clientHeight;
          const areaWidth = cropper.clientWidth;

          let currentHeight = areaHeight;
          let currentWidth = imageWidth * areaHeight / imageHeight

          if (currentWidth > areaWidth) {
            currentWidth = areaWidth;
            currentHeight = imageHeight * areaWidth / imageWidth;
          }

          return {
            width: currentWidth,
            height: currentHeight
          }
      }
    },
    minWidth: {
      type: [Number, String],
      default: 10,
    },
    minHeight: {
      type: [Number, String],
      default: 10,
    },
    maxWidth: {
      type: [Number, String],
      default: 100,
    },
    maxHeight: {
      type: [Number, String],
      default: 100,
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
    debounce: {
      type: Number,
      default: 500
    }
  },
  computed: {
    coefficient() {
      return this.imageSize.width ? (this.boundarySize.width / this.imageSize.width) : 0
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
    areaStyle() {
      return {
        width: this.boundarySize.width ? `${this.boundarySize.width}px` : 'auto',
        height: this.boundarySize.height ? `${this.boundarySize.height}px` : 'auto',
      };
    },
    restrictions() {
      return {
        minHeight: this.imageSize.height * this.minHeight / 100,
        minWidth: this.imageSize.width * this.minWidth / 100,
        maxHeight: this.imageSize.height * this.maxHeight / 100,
        maxWidth: this.imageSize.width * this.maxWidth / 100,
      }
    }
  },
  data() {
    return {
      boundarySize: {
        width: null,
        height: null
      },
      imageSize: {
        width: null,
        height: null
      },
      coordinates: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
    }
  },
  mounted() {
    this.onChangeImage();
    this.debouncedUpdateCoordinates = debounce(this.updateCoordinates, this.debounce)
  },
  created() {
		window.addEventListener("resize", this.refreshImage, false);
		window.addEventListener("orientationchange", this.refreshImage, false);
	},
	destroyed () {
		window.removeEventListener("resize", this.refreshImage);
		window.removeEventListener("orientationchange", this.refreshImage);
	},
  methods: {
    updateCanvas(coordinates) {
      const canvas = this.$refs.canvas
      canvas.width = coordinates.width;
      canvas.height = coordinates.height;

      const ctx = canvas.getContext('2d')
      const image = this.$refs.image
      ctx.drawImage(image,
        coordinates.left, coordinates.top,
        coordinates.width, coordinates.height, 
        0, 0, 
        coordinates.width, coordinates.height
      )
    },
    updateCoordinates(coordinates) {
      const stencil = this.$refs.stencil
      this.updateCanvas(coordinates)
      this.$emit('change', {
        coordinates: coordinates,
        canvas: this.$refs.canvas,
      })
    },
    onChangeCoordinates(newCoordinates) {
      this.coordinates = newCoordinates
      this.debouncedUpdateCoordinates(newCoordinates)
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
    onResize(resizeEvent) {
      this.onChangeCoordinates(this.resizeAlgorithm(
        this.coordinates, 
        this.restrictions, 
        this.imageSize,
        this.coefficient, 
        this.stencilAspectRatio(),
        resizeEvent
      ))
    },
    onMove(moveEvent) {
      this.onChangeCoordinates(this.moveAlgorithm(
        this.coordinates, 
        this.restrictions, 
        this.imageSize,
        this.coefficient, 
        moveEvent
      ))
    },
    resetCoordinates() {
      const cropper = this.$refs.cropper
      const image = this.$refs.image
      const imageSize = this.imageSize
      const { minWidth, minHeight, maxWidth, maxHeight } = this.restrictions
      const aspectRatio = this.stencilAspectRatio()
      const coefficient = this.coefficient

      let coordinates = {}

      if (minWidth * aspectRatio.minimum < minHeight) {
        coordinates.height = minHeight
        coordinates.width = aspectRatio.maximum ? minHeight * aspectRatio.maximum : minWidth
      }
      else {
        coordinates.width = minWidth
        coordinates.height = aspectRatio.minimum ? minWidth * aspectRatio.minimum : minHeight
      }

      if (coordinates.height < minHeight || coordinates.height > maxHeight) {
        throw ("Current aspect ratio can't is uncompatible with minimum/maximum height and width settings. Can't setup default coordinates")
      }

      coordinates.left = imageSize.width / 2 - coordinates.width / 2
      coordinates.top = imageSize.height / 2 - coordinates.height / 2

      const defaultSize = this.defaultSize(cropper, image, this.$props);
      coordinates = this.resizeAlgorithm(coordinates, this.restrictions, imageSize, coefficient, aspectRatio, new ResizeEvent(null, {
        left: (defaultSize.width - coordinates.width) / (2*coefficient),
        right: (defaultSize.width - coordinates.width) / (2*coefficient),
        top: (defaultSize.height - coordinates.height) / (2*coefficient),
        bottom: (defaultSize.height - coordinates.height) / (2*coefficient),
      }))

      const defaultPosition = this.defaultPosition(cropper, image, coordinates.width, coordinates.height, this.$props)
      coordinates = this.moveAlgorithm(coordinates, this.restrictions, imageSize, coefficient, new MoveEvent(null, {
        left: (coordinates.left - defaultPosition.left) / (coefficient),
        top: (coordinates.top - defaultPosition.top) / (coefficient),
      }))

      this.onChangeCoordinates(coordinates)
    },
    refreshImage() {
      return new Promise((resolve) => {
        const image = this.$refs.image
        const cropper = this.$refs.cropper

        this.imageSize.height = image.naturalHeight
        this.imageSize.width = image.naturalWidth

        this.boundarySize.width = cropper.clientWidth
        this.boundarySize.height = cropper.clientHeight

        Vue.nextTick(() => {
          const {height, width} = this.areaSize(cropper, image)
          if (height) {
            this.boundarySize.height = height
          }
          if (width) {
            this.boundarySize.width = width
          }
          resolve();
        })
      })
    },
    stencilAspectRatio() {
      if (this.$refs.stencil.aspectRatios) {
        return this.$refs.stencil.aspectRatios() 
      } else {
        return {
          minimum: this.stencilProps.aspectRatio || this.stencilProps.minAspectRatio,
          maximum: this.stencilProps.aspectRatio || this.stencilProps.maxAspectRatio,
        }
      }
    }
  },
};
</script>

<template>
  <div :class="classes.cropper" ref="cropper">
    <img :src="src" :class="classes.image" :style="areaStyle" ref="image"/>
    <div :class="classes.area" :style="areaStyle">
      <div :class="classes.stencilWrapper" :style="wrapperStyle" ref="stencil">
        <component 
          :is="stencilComponent" 
          :img="src"
          :left="coordinates.left"
          :top="coordinates.top"
          :width="coordinates.width"
          :height="coordinates.height"
          :stencil-width="stencilCoordinates.width"
          :stencil-height="stencilCoordinates.height"
          :cropper-data="{
            maxWidth: restrictions.maxWidth,
            minWidth: restrictions.minWidth,
            maxHeight: restrictions.maxHeight,
            minHeight: restrictions.minHeight,
            imageWidth: imageSize.width, 
            imageHeight: imageSize.height, 
          }"
          @resize="onResize"
          @move="onMove"
          v-bind="stencilProps"
        />
       <canvas ref="canvas" :style="{display:'none'}"></canvas>
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
    user-select: none;
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