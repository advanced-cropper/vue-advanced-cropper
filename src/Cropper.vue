<script>

import classnames from 'classnames';
import bem from 'easy-bem';
import Vue from 'vue';
import RectangleStencil from './components/stencils/RectangleStencil.vue'
import {approximiateEqual} from './utils/services.js'

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
      default: function(cropper, image, {stencilProps, ...props}) {

        if (props.minWidth > props.maxWidth) {
          throw ("Minimum width can't be more than maximum width. Can't setup default coordinates")
        }
        if (props.maxWidth < props.maxWidth) {
          throw ("Maximum width can't be more than minimum width. Can't setup default coordinates")
        }
        if (props.minHeight > props.maxHeight) {
          throw ("Minimum height can't be more than maximum height. Can't setup default coordinates")
        }
        if (props.maxHeight < props.maxHeight) {
          throw ("Maximum height can't be more than minimum height. Can't setup default coordinates")
        }
        if (props.minAspectRatio > props.maxAspectRatio) {
          throw ("Minimum aspect ratio can't be more than maximum aspect ratio. Can't setup default coordinates")
        }

        const minWidth = props.minWidth / 100 * image.naturalWidth
        const minHeight = props.minHeight / 100 * image.naturalHeight
        const maxWidth = props.maxWidth / 100 * image.naturalWidth
        const maxHeight = props.maxHeight / 100 * image.naturalHeight

        const aspectRatio = {
          minimum: stencilProps.aspectRatio || stencilProps.minAspectRatio,
          maximum: stencilProps.aspectRatio || stencilProps.maxAspectRatio,
        }

        const minBoundaries = {}

        if (minWidth * aspectRatio.minimum < minHeight) {
          console.log("Первый случай")
          minBoundaries.height = minHeight
          minBoundaries.width = aspectRatio.maximum ? minHeight * aspectRatio.maximum : minWidth
          minBoundaries.aspectRatio = aspectRatio.maximum || (minWidth/minHeight)
        }
        else {
          console.log("Второй случай")
          
          minBoundaries.width = minWidth
          minBoundaries.height = aspectRatio.minimum ? minWidth * aspectRatio.minimum : minHeight
          minBoundaries.aspectRatio = aspectRatio.minimum || (minWidth/minHeight)
        }


        if (minBoundaries.height < minHeight || minBoundaries.height > maxHeight) {
          throw ("Current aspect ratio can't is uncompatible with minimum/maximum height and width settings. Can't setup default coordinates")
        }

        const maxBoundaries = {}

        if (maxWidth * aspectRatio.minimum > maxHeight) {
          maxBoundaries.height = maxHeight
          maxBoundaries.width = aspectRatio.maximum ? maxHeight * aspectRatio.maximum : maxWidth
          maxBoundaries.aspectRatio = aspectRatio.maximum || (maxWidth/maxHeight)
        }
        else {
          maxBoundaries.width = maxWidth
          maxBoundaries.height = aspectRatio.minimum ? maxWidth * aspectRatio.minimum : maxHeight
          maxBoundaries.aspectRatio = aspectRatio.minimum || (maxWidth/maxHeight)
        }


        let width, height;
        if (maxBoundaries.height > maxBoundaries.width) {
          height = Math.max(minBoundaries.height, maxBoundaries.height * (0.95 - Math.pow(maxBoundaries.aspectRatio, 6)))
          width = width/ minBoundaries.aspectRatio
        }
        else {
          width = Math.max(minBoundaries.width, maxBoundaries.width * (0.95 - Math.pow(minBoundaries.aspectRatio, 6)))
          height = Math.min(maxHeight, width / maxBoundaries.aspectRatio)
        }
        console.log(maxBoundaries, minBoundaries, this.restrictions, {height, width})

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
    },
    restrictions() {
      return {
        minHeight: this.imageNaturalHeight * this.minHeight / 100,
        minWidth: this.imageNaturalWidth * this.minWidth / 100,
        maxHeight: this.imageNaturalHeight * this.maxHeight / 100,
        maxWidth: this.imageNaturalWidth * this.maxWidth / 100,
      }
    }
  },
  data() {
    return {
      imageWidth: null,
      imageHeight: null,
      imageNaturalHeight: null,
      imageNaturalWidth: null,
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
    onChangeCoordinates(newCoordinates) {
      const stencil = this.$refs.stencil
      this.coordinates = newCoordinates
      this.$emit('change', {
        coordinates: newCoordinates,
        // canvas: this.canvas(),
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
    onResize(resizeDirections) {
      const coefficient = this.coefficient
      let directions = {...resizeDirections}

      const actualCoordinates = {
        width: this.coordinates.width,
        height: this.coordinates.height,
        left: this.coordinates.left,
        top: this.coordinates.top,
        right: this.coordinates.left + this.coordinates.width,
        bottom: this.coordinates.top + this.coordinates.height,
      }

      const imageNaturalWidth = this.imageWidth / coefficient;
      const imageNaturalHeight = this.imageHeight / coefficient;

      // Respect minimal and maximal size:
      const minHeight = (this.minHeight/100) * imageNaturalHeight
      const minWidth = (this.minWidth/100) * imageNaturalWidth

      const maxHeight = this.maxHeight * imageNaturalHeight /100
      const maxWidth = this.maxWidth * imageNaturalWidth /100

      const newWidth = actualCoordinates.width + coefficient*(directions.left + directions.right)
      const newHeight = actualCoordinates.height + coefficient*(directions.top + directions.bottom)

      // const shifts = {...directions}
      // if (newWidth < minWidth || newWidth > maxWidth) {
      //   const overlapWidth = Math.abs(0, newWidth < minWidth ? newWidth - minWidth : newWidth - maxWidth )
      //   directions.left = overlapWidth / coefficient * (shifts.left / (shifts.left + shifts.right)) 
      //   directions.right = overlapWidth / coefficient * (shifts.right / (shifts.left + shifts.right)) 
      // }
      // if (newHeight < minHeight || newHeight > maxHeight && (directions.top || directions.bottom)) {
      //   const overlapHeight = Math.abs(0, newHeight < minHeight ? newHeight - minHeight : newHeight - maxHeight)
      //   directions.top = overlapHeight / coefficient * (shifts.top / (shifts.top + shifts.bottom)) 
      //   directions.bottom = overlapHeight / coefficient * (shifts.bottom / (shifts.top + shifts.bottom)) 
      // }

      // let overlaps = {
      //   width: 0,
      //   height: 0
      // }

      // if (newWidth < minWidth || newWidth > maxWidth) {
      //   overlaps.width = (newWidth < minWidth) ? (minWidth - newWidth)  : (maxWidth - newWidth)
      // }

      // if (newHeight < minHeight || newHeight > maxHeight) {
      //   overlaps.height = (newHeight < minHeight) ? (minHeight - newHeight) : (maxHeight - newHeight)
      // }

      // if (overlaps.height || overlaps.width) {
      //   const firstMultiplier = (newHeight + overlaps.height - actualCoordinates.height) / ((directions.bottom + directions.top) * coefficient)
      //   const secondMultiplier = (newWidth + overlaps.width - actualCoordinates.width) / ((directions.right + directions.left) * coefficient)

      //   let multiplier;
      //   if (overlaps.height && overlaps.width) {
      //     if (Math.abs(firstMultiplier) < Math.abs(secondMultiplier)) {
      //       multiplier = firstMultiplier
      //     } else {
      //       multiplier = secondMultiplier
      //     }
      //   } else if (overlaps.height) {
      //     multiplier = firstMultiplier
      //   } else if (overlaps.width) {
      //     multiplier = secondMultiplier
      //   }

      //   const availableDirections = ['left', 'right', 'top', 'bottom']
      //   availableDirections.forEach(direction => {
      //     directions[direction] *= multiplier
      //   })

      // }





      // if (newWidth < minWidth || newWidth > maxWidth || newHeight < minHeight || newHeight > maxHeight) {
      //   directions.top = 0
      //   directions.bottom = 0
      //   directions.left = 0
      //   directions.right = 0
      // }

      // Здесь нужно поменять так, чтобы насколько сократили одно продвижение, настолько сократили и другие

      // Checking overlap:
      // const leftOverlap = actualCoordinates.left - coefficient*directions.left < 0
      // const topOverlap = actualCoordinates.top - coefficient*directions.top  < 0
      // const rightOverlap = coefficient*directions.right + actualCoordinates.right >= imageNaturalWidth
      // const bottomOverlap = coefficient*directions.bottom + actualCoordinates.bottom >= imageNaturalHeight
      // if (!leftOverlap && !rightOverlap && !topOverlap && !bottomOverlap) {
        this.onChangeCoordinates({
          width: this.coordinates.width + coefficient * (directions.right + directions.left),
          height: this.coordinates.height + coefficient * (directions.top + directions.bottom),
          left: this.coordinates.left - coefficient * directions.left,
          top: this.coordinates.top - coefficient * directions.top
        })
      // }
    },
    onMove({directions}) {
      const newCoordinates = {
        left: this.coordinates.left + this.coefficient * directions.left,
        top: this.coordinates.top + this.coefficient * directions.top,
        width: this.coordinates.width,
        height: this.coordinates.height
      }

      if (newCoordinates.left < 0) {
        newCoordinates.left = 0
      }
      if (newCoordinates.left + newCoordinates.width > this.imageWidth / this.coefficient) {
        newCoordinates.left = Math.max(0, this.imageWidth / this.coefficient - newCoordinates.width)
      }
      if (newCoordinates.top < 0) {
        newCoordinates.top = 0
      }
      if (newCoordinates.top + newCoordinates.height > this.imageHeight / this.coefficient) {
        newCoordinates.top = Math.max(0, this.imageHeight / this.coefficient - newCoordinates.height)
      }

      this.onChangeCoordinates(newCoordinates)
    },
    resetCoordinates() {
      this.onChangeCoordinates(this.defaultCoordinates(this.$refs.cropper, this.$refs.image, this.$props));
    },
    refreshImage() {
      return new Promise((resolve) => {
        const image = this.$refs.image
        const cropper = this.$refs.cropper

        this.imageWidth = null;
        this.imageHeight = null;

        this.imageNaturalHeight = image.naturalHeight
        this.imageNaturalWidth = image.naturalWidth

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
    },
    stencilAspectRatio() {
      if (this.$refs.stencil.aspectRatio) {
        return this.$refs.stencil.aspectRatio() 
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
    <img :src="src" :class="classes.image" :style="imageStyle" ref="image"/>
    <div :class="classes.area" :style="imageStyle">
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
          :min-width="restrictions.minWidth"
          :max-width="restrictions.maxWidth"
          :min-height="restrictions.minHeight"
          :max-height="restrictions.maxHeight"
          :image-width="imageNaturalWidth"
          :image-height="imageNaturalHeight"
          @resize="onResize"
          @move="onMove"
          v-bind="stencilProps"
        />
       <canvas ref="canvas"></canvas>
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