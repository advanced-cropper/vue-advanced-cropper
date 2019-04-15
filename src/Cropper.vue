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
      default: function(cropper, image, props) {
        let aspectRatio = props.aspectRatio
        if (!aspectRatio) {
          if (props.minAspectRatio && props.maxAspectRatio) {
            aspectRatio = (props.minAspectRatio + props.maxAspectRatio)/2
          }
          else if (props.minAspectRatio) {
            aspectRatio = props.minAspectRatio
          }
          else if (props.maxAspectRatio) {
            aspectRatio = props.maxAspectRatio
          }
        }

        const baseSize = Math.min(image.naturalWidth, image.naturalHeight)

        let width, height;
        if (!aspectRatio) {
          width =  baseSize / 2;
          height = width
        }
        else if (aspectRatio < 1) {
          height = baseSize * Math.max(0.5, 0.95 - Math.pow(aspectRatio, 6));
          width = height * aspectRatio
        }
        else {
          width = baseSize * Math.max(0.5, 0.95 - Math.pow(1/aspectRatio, 6));
          height = width * 1/aspectRatio
        }

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
    maxWidth: {
      type: [Number, String],
    },
    maxHeight: {
      type: [Number, String],
    },
    aspectRatio: {
      type: [Number, String],
    },
    minAspectRatio: {
      type: [Number, String],
    },
    maxAspectRatio: {
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
      const processedCoordinates = this.processCoordinates(newCoordinates)
      this.coordinates = processedCoordinates
      this.$emit('change', {
        coordinates: {
          ...processedCoordinates
        },
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
    onResize(resizeEvent) {
      const coefficient = this.coefficient
      const anchor = resizeEvent.anchor
      const horizontalDirection = resizeEvent.horizontalDirection
      const verticalDirection = resizeEvent.verticalDirection
      let directions = {...resizeEvent.scaling}

      const actualCoordinates = {
        ...this.coordinates,
        right: this.coordinates.left + this.coordinates.width,
        bottom: this.coordinates.top + this.coordinates.height,
      }

      const frozenDirections = {
        left: false,
        right: false,
        top: false,
        bottom: false
      }


      // let aspectRatio = this.aspectRatio || (nativeEvent.shiftKey ? this.width / this.height : null)

      // if (!aspectRatio && this.minAspectRatio && coordinates.width/coordinates.height < this.minAspectRatio) {
      //   aspectRatio = this.minAspectRatio
      // }
      // if (!aspectRatio && this.minAspectRatio && coordinates.width/coordinates.height > this.maxAspectRatio) {
      //   aspectRatio = this.maxAspectRatio
      // }


      // if (aspectRatio) {
        
      // }

      const minHeight = 100
      const minWidth = 100 * this.minAspectRatio

      if (actualCoordinates.width + coefficient*(directions.left + directions.right) < minWidth) {
        const overlapWidth = Math.max(0, actualCoordinates.width + coefficient*(directions.left + directions.right) - minWidth)
        if (verticalDirection === 'east') {
          directions.left = -overlapWidth / coefficient 
        }
        else if (verticalDirection === 'west') {
          directions.right = -overlapWidth / coefficient 
        }
      }

      if (actualCoordinates.height + coefficient*(directions.top + directions.bottom) < minHeight) {
        const overlapHeight = Math.max(0, actualCoordinates.height + coefficient*(directions.top + directions.bottom) - minHeight)
        if (verticalDirection === 'north') {
          directions.top = -overlapHeight / coefficient 
        }
        else if (verticalDirection === 'south') {
          directions.bottom = -overlapHeight / coefficient 
        }
      }



      const newWidth = actualCoordinates.width + coefficient * (directions.left + directions.right)
      const newHeight = actualCoordinates.height + coefficient * (directions.top + directions.bottom)





      let ratioBroken = null;
      if (this.aspectRatio && newWidth / newHeight !== this.aspectRatio) {
        ratioBroken = this.aspectRatio
      }
      else if (this.minAspectRatio && newWidth / newHeight < this.minAspectRatio) {
        ratioBroken = this.minAspectRatio
      }
      else if (this.maxAspectRatio && newWidth / newHeight > this.maxAspectRatio) {
        ratioBroken = this.maxAspectRatio
      }
      


      if (ratioBroken) {
        const shifts = {...directions}
        //if (horizontalDirection && verticalDirection) {
          if (newWidth > newHeight) {
            let overlapWidth = actualCoordinates.width - newWidth
            let overlapHeight = actualCoordinates.height - newWidth / ratioBroken
            console.log("ШИРИНА БОЛЬШЕ", newWidth,newHeight )
            if (verticalDirection === 'north') {
              directions.top = -overlapHeight  / coefficient
            }
            else if (verticalDirection === 'south') {
              directions.bottom = -overlapHeight  / coefficient
            }
            else if (horizontalDirection === 'east') {
              directions.right = 0
            }
            else if (horizontalDirection === 'west') {
              directions.left = 0
            }

          }
          else {
            let overlapHeight = actualCoordinates.height - newHeight
            let overlapWidth = actualCoordinates.width - newHeight * ratioBroken

            console.log("ВЫСОТА БОЛЬШЕ", newWidth,newHeight )

            if (horizontalDirection === 'west') {
              directions.left = -overlapWidth  / coefficient
            }
            else if (horizontalDirection === 'east') {
              directions.right = -overlapWidth  / coefficient
            }
            else if (verticalDirection === 'north') {
              directions.top = 0
            }
            else if (verticalDirection === 'south') {
              directions.bottom = 0
            }
          }
       //}
        

      }


      // if (horizontalDirection === 'east' && !verticalDirection) {
      //   if (coefficient*directions.right + actualCoordinates.right > imageNaturalWidth) {
      //     directions.right = Math.max(0, imageNaturalWidth - actualCoordinates.right) / coefficient
      //   }
      //   if (ratioBroken) {
      //     directions.right = (actualCoordinates.height * ratioBroken - actualCoordinates.width) / coefficient
      //   }
      // }
      // if (horizontalDirection === 'west' && !verticalDirection) {
      //   if (actualCoordinates.left - coefficient*directions.left < 0) {
      //     directions.left = 0
      //   }
      //   if (ratioBroken) {
      //     directions.left = (actualCoordinates.height * ratioBroken - actualCoordinates.width) / coefficient
      //   }
      // }
      // if (verticalDirection === 'south' && !horizontalDirection) {
      //   if (coefficient*directions.bottom + actualCoordinates.bottom > imageNaturalHeight) {
      //     directions.bottom = Math.max(0, imageNaturalHeight - actualCoordinates.bottom) / coefficient;
      //   }
      //   if (ratioBroken) {
      //     directions.bottom = (actualCoordinates.width / ratioBroken - actualCoordinates.height) / coefficient
      //   }
      // }
      // if (verticalDirection === 'north' && !horizontalDirection) {
      //   if (actualCoordinates.top - coefficient*directions.bottom  < 0) {
      //     directions.top = 0;
      //   }
      //   if (ratioBroken) {
      //     directions.top = (actualCoordinates.width / ratioBroken - actualCoordinates.height) / coefficient
      //   }
      // }



      const processDirection = (directions, currentDirection, value) => {
        const result = {...directions}
        const currentShift = directions[currentDirection]
        const multiplier = Math.abs(value/currentShift)
        const variants = ['left', 'right', 'top', 'bottom']
        //if (ratioBroken) {
          variants.forEach(direction => {
           // if (direction !== currentDirection) {
              result[direction] = 0
          //  }
          })
        //}
        result[currentDirection] = 0
        return result;
      }

      const imageNaturalWidth = this.imageWidth / coefficient;
      const imageNaturalHeight = this.imageHeight / coefficient;



      // Undoing the resizing, that will overlap boundaries
      if (actualCoordinates.left - coefficient*directions.left  < 0) {
        directions = processDirection(directions, 'left', 0)
      }
      if (actualCoordinates.top - coefficient*directions.top  < 0) {
        directions = processDirection(directions, 'top', 0)
      }

      if (coefficient*directions.right + actualCoordinates.right > imageNaturalWidth) {
        directions = processDirection(directions, 'right', Math.max(0, imageNaturalWidth - actualCoordinates.right) / coefficient)
      }
      if (coefficient*directions.bottom + actualCoordinates.bottom > imageNaturalHeight) {
        directions = processDirection(directions, 'bottom', Math.max(0, imageNaturalHeight - actualCoordinates.bottom) / coefficient)
      }






      const coordinates = {
        width: this.coordinates.width + coefficient * (directions.right + directions.left),
        height: this.coordinates.height + coefficient * (directions.top + directions.bottom),
        left: this.coordinates.left - coefficient * directions.left,
        top: this.coordinates.top - coefficient * directions.top
      }



      this.onChangeCoordinates(coordinates)
    },
    onMove({directions}) {
      this.onChangeCoordinates({
        left: this.coordinates.left + this.coefficient * directions.left,
        top: this.coordinates.top + this.coefficient * directions.top,
        width: this.coordinates.width,
        height: this.coordinates.height
      })
    },
    processCoordinates(receivedCoordinates) {

      const newCoordinates = {
        ...receivedCoordinates
      }
      const changeWidth = newCoordinates.width - this.coordinates.width
      const changeHeight = newCoordinates.height - this.coordinates.height



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

      //       if (this.aspectRatio ) {
        
      //   if (this.aspectRatio >= 1) {
      //     if (newCoordinates.width / this.aspectRatio !== newCoordinates.height) {
      //       newCoordinates.height = newCoordinates.width / this.aspectRatio
      //     }
      //   }
      //   else {
      //     if (newCoordinates.width !== newCoordinates.height * this.aspectRatio) {
      //       newCoordinates.width = newCoordinates.height * this.aspectRatio
      //     }
      //   }
      // }
      return newCoordinates
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
          @resize="onResize"
          @move="onMove"
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