<script>
import classnames from 'classnames'
import bem from 'easy-bem'
import Vue from 'vue'
import debounce from 'debounce'

import { RectangleStencil } from './components/stencils'
import { approximiateEqual } from './utils/services'

import {
  HORIZONTAL_DIRECTIONS,
  VERTICAL_DIRECTIONS,
  ALL_DIRECTIONS
} from './utils/constants'

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
      default: function(cropper, image, aspectRatio, props) {
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
          height = Math.max(minBoundaries.height, maxBoundaries.height * 0.8)
          width = width/ minBoundaries.aspectRatio
        }
        else {
          width = Math.max(minBoundaries.width, maxBoundaries.width * 0.8)
          height = Math.min(maxHeight, width / maxBoundaries.aspectRatio)
        }

        const desiredAspectRatio = maxWidth / maxHeight
        
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
        //params: stencil.params()
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
      const actualCoordinates = {
        width: this.coordinates.width,
        height: this.coordinates.height,
        left: this.coordinates.left,
        top: this.coordinates.top,
        right: this.coordinates.left + this.coordinates.width,
        bottom: this.coordinates.top + this.coordinates.height,
      }

      const directions = resizeEvent.directions

      const allowedDirections = resizeEvent.allowedDirections || {
        left: true,
        right: true,
        bottom: true,
        top: true
      }

      Object.keys(allowedDirections).forEach(direction => {
        if (!allowedDirections[direction]) {
          directions[direction] = 0
        }
      })

      const event = resizeEvent.nativeEvent;

      // Variables for readibility
      const coefficient = this.coefficient
      const aspectRatio = this.stencilAspectRatio()
      const {minHeight, minWidth, maxWidth, maxHeight} = this.restrictions


      // 1. First step: checks, that desired box not fewer minWidth and minHeight
      let currentWidth = actualCoordinates.width + coefficient*(directions.left + directions.right)
      let currentHeight = actualCoordinates.height + coefficient*(directions.top + directions.bottom)

      if (currentWidth < minWidth) {
        const multiplier = (directions.right + directions.left) ? (minWidth - actualCoordinates.width) / ((directions.right + directions.left) * coefficient) : 0
        HORIZONTAL_DIRECTIONS.forEach(direction => {
          directions[direction] *= multiplier
        })
      }
    
      if (currentHeight < minHeight) {
        const multiplier = (directions.bottom + directions.top) ? (minHeight - actualCoordinates.height) / ((directions.bottom + directions.top) * coefficient) : 0
        VERTICAL_DIRECTIONS.forEach(direction => {
          directions[direction] *= multiplier
        })
      }

      // 2. Second step: fix desired box to correspondent to aspect ratio
      currentWidth = actualCoordinates.width + coefficient*(directions.left + directions.right)
      currentHeight = actualCoordinates.height + coefficient*(directions.top + directions.bottom)

      // Checks ratio:
      let ratioBroken = null;
      if (event.shiftKey) {
        ratioBroken = actualCoordinates.width / actualCoordinates.height
      } else if (aspectRatio.minimum && currentWidth / currentHeight < aspectRatio.minimum) {
        ratioBroken = aspectRatio.minimum
      } else if (aspectRatio.maximum && currentWidth / currentHeight > aspectRatio.maximum) {
        ratioBroken = aspectRatio.maximum
      }
  
      if (ratioBroken) {
        // Fix width
       if (Math.sqrt(Math.pow(currentWidth / ratioBroken - actualCoordinates.height,2) + Math.pow(currentWidth - actualCoordinates.width,2)) < Math.sqrt(Math.pow(currentHeight - actualCoordinates.height, 2) + Math.pow(currentHeight * ratioBroken - actualCoordinates.width, 2)) && currentWidth / ratioBroken >= minHeight) {
          let overlapWidth = actualCoordinates.width - currentWidth
          let overlapHeight = actualCoordinates.height - currentWidth / ratioBroken
          if (allowedDirections.top && allowedDirections.bottom) {
            directions.bottom = -overlapHeight / (2*coefficient)
            directions.top = -overlapHeight / (2*coefficient)
          }
          else if (allowedDirections.top) {
            directions.top = -overlapHeight  / coefficient
          }
          else if (allowedDirections.bottom) {
            directions.bottom = -overlapHeight  / coefficient
          }
          else if (allowedDirections.right) {
            directions.right = 0
          }
          else if (allowedDirections.left) {
            directions.left = 0
          }
        }
         // Fix height
        else if (currentHeight * ratioBroken >= minWidth) {
          let overlapHeight = actualCoordinates.height - currentHeight
          let overlapWidth = actualCoordinates.width - currentHeight * ratioBroken
          if (allowedDirections.left && allowedDirections.right) {
            directions.left = -overlapWidth  / (2*coefficient)
            directions.right = -overlapWidth  / (2*coefficient)
          }
          else if (allowedDirections.left) {
            directions.left = -overlapWidth  / coefficient
          }
          else if (allowedDirections.right) {
            directions.right = -overlapWidth  / coefficient
          }
          else if (allowedDirections.top) {
            directions.top = 0
          }
          else if (allowedDirections.bottom) {
            directions.bottom = 0
          }
        }
      }

      // 3. Third step: check if desired box with correct aspect ratios break some limits
      currentWidth = actualCoordinates.width + coefficient*(directions.left + directions.right)
      currentHeight = actualCoordinates.height + coefficient*(directions.top + directions.bottom)

      const maxResize = {
        width: Infinity,
        height: Infinity
      }
 
      if (Math.floor(actualCoordinates.left + actualCoordinates.width + coefficient*directions.right) > this.imageNaturalWidth) {
        maxResize.width = Math.min(maxResize.width, this.imageNaturalWidth - (actualCoordinates.left + actualCoordinates.width))
      }
      if (actualCoordinates.left - coefficient*directions.left < 0) {
        maxResize.width = Math.min(maxResize.width, actualCoordinates.left)
      }
      if (currentWidth < minWidth) {
        maxResize.width = Math.min(maxResize.width, minWidth - actualCoordinates.width)
      } 
      if (currentWidth > maxWidth) {
        maxResize.width = Math.min(maxResize.width, maxWidth - actualCoordinates.width)
      }

      if (Math.floor(actualCoordinates.top + actualCoordinates.height + coefficient*directions.bottom) > this.imageNaturalHeight) {
        maxResize.height = Math.min(maxResize.height, this.imageNaturalHeight - (actualCoordinates.top + actualCoordinates.height))
      }
      if (actualCoordinates.top - coefficient*directions.top < 0) {
        maxResize.height = Math.min(maxResize.height, actualCoordinates.top)
      } 
      if (currentHeight < minHeight) {
        maxResize.height = Math.min(maxResize.height, minHeight - actualCoordinates.height)
      } 
      if (currentHeight > maxHeight) {
        maxResize.height = Math.min(maxResize.height, maxHeight - actualCoordinates.height)
      }

      if (maxResize.width !== Infinity && (directions.right + directions.left) ) {
        const multiplier = maxResize.width / ((directions.right + directions.left)* coefficient)
        HORIZONTAL_DIRECTIONS.forEach(direction => {
          directions[direction] *= multiplier
        })
      }

      if (maxResize.height !== Infinity && (directions.bottom + directions.top) ) {
        const multiplier = maxResize.height / ((directions.bottom + directions.top) * coefficient)
        VERTICAL_DIRECTIONS.forEach(direction => {
          directions[direction] *= multiplier
        })
      }

      // 4. Fourth step: undo some resizes to correspondent with aspect ratio and limits simultaneosly
      const limitedWidth = actualCoordinates.width + coefficient*(directions.left + directions.right)
      const limitedHeight = actualCoordinates.height + coefficient*(directions.top + directions.bottom)
      
      if (event.shiftKey && limitedWidth / limitedHeight !== actualCoordinates.width / actualCoordinates.height) {
        ratioBroken = actualCoordinates.width / actualCoordinates.height
      } else if (limitedWidth / limitedHeight < aspectRatio.minimum) {
        ratioBroken = aspectRatio.minimum
      } else if (limitedWidth / limitedHeight > aspectRatio.maximum) {
        ratioBroken = aspectRatio.maximum
      }
      if (ratioBroken) {
        if (ratioBroken > 0) {
          const multiplier = (directions.right + directions.left) ? (limitedHeight * ratioBroken - actualCoordinates.width) / ((directions.right + directions.left) * coefficient) : 0
          HORIZONTAL_DIRECTIONS.forEach(direction => {
            directions[direction] *= multiplier
          })
        }
        else {
          const multiplier = directions.bottom + directions.top ? (limitedWidth / ratioBroken - actualCoordinates.height) / ((directions.top + directions.bottom) * coefficient) : 0
          VERTICAL_DIRECTIONS.forEach(direction => {
            directions[direction] *= multiplier
          })
        }
      }
      this.onChangeCoordinates({
        width: this.coordinates.width + coefficient * (directions.right + directions.left),
        height: this.coordinates.height + coefficient * (directions.top + directions.bottom),
        left: this.coordinates.left - coefficient * directions.left,
        top: this.coordinates.top - coefficient * directions.top
      })
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
      this.onChangeCoordinates(this.defaultCoordinates(this.$refs.cropper, this.$refs.image, this.stencilAspectRatio(), this.$props));
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
          :cropper-data="{
            maxWidth: restrictions.maxWidth,
            minWidth: restrictions.minWidth,
            maxHeight: restrictions.maxHeight,
            minHeight: restrictions.minHeight,
            imageWidth: imageNaturalWidth, 
            imageHeight: imageNaturalHeight, 
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