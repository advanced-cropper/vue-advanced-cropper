<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import PreviewImage from '../service/PreviewImage.vue';
import BoundingBox from '../service/BoundingBox.vue';
import MoveableContainer from '../service/MoveableContainer.vue';

import {
  NORTH,
  EAST,
  WEST,
  SOUTH
} from '../../utils/constants.js'

const cn = bem('vue-rectangle-stencil')

export default {
  name: "RectangleStencil",
  components: {
    PreviewImage, BoundingBox, MoveableContainer
  },
  props: {
    img: {
      type: String
    },
    stencilClass: {
       type: String
    },
    height: {
       type: Number,
       default: 0
    },
    width: {
       type: Number,
       default: 0
    },
    stencilHeight: {
       type: Number
    },
    stencilWidth: {
       type: Number
    },
    left: {
       type: Number
    },
    top: {
       type: Number
    },
    imageWidth: {
       type: Number
    },
    imageHeight: {
       type: Number
    },
    disableDefaultClasses: {
      type: Boolean,
      default: false
    },
    handlerClassnames: {
      type: Object,
      default() {
        return {}
      },
    },
    lineClassnames: {
      type: Object,
      default() {
        return {}
      },
    },
    handlerComponent: {
      type: [Object, String],
    },
    lineComponent: {
      type: [Object, String],
    },
    type: {
      type: String,
      default: 'RectangleStencil'
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
  },
  methods: {
    crop(left, top, height, width) {
      return {
        stencil: {
          type: this.type,
        },
        coordinates: {
          left, top, height, width
        },
        canvas: null,
      }
    },
    onMove(moveEvent) {
      this.$emit('move', moveEvent)
      return
      const coefficient = this.width / this.stencilWidth
      this.$emit('change', {
        left: this.left + coefficient * move.left,
        top: this.top + coefficient * move.top,
        width: this.width,
        height: this.height
      })
    },
    onResize(resizeEvent) {

      const {
        horizontalDirection,
        verticalDirection
      } = resizeEvent.params

      const actualCoordinates = {
        width: this.width,
        height: this.height,
        left: this.left,
        top: this.top,
      }

      const directions = resizeEvent.directions

      const resize = resizeEvent.directions
      const event = resizeEvent.nativeEvent;
      const coefficient = this.width / this.stencilWidth

      // Respect minimal size:
      const minHeight = this.minHeight
      const minWidth = this.minWidth
      const maxHeight = this.maxHeight
      const maxWidth = this.maxWidth

      let newWidth = actualCoordinates.width + coefficient*(directions.left + directions.right)
      let newHeight = actualCoordinates.height + coefficient*(directions.top + directions.bottom)

      let maxResize = {
        width: Infinity,
        height: Infinity
      }

      if (actualCoordinates.left + actualCoordinates.width + coefficient*directions.right > this.imageWidth + 0.001) {
        console.log("право", directions)
        
        maxResize.width = Math.min(maxResize.width, this.imageWidth - (actualCoordinates.left + actualCoordinates.width))
      }
      if (actualCoordinates.left - coefficient*directions.left < 0) {
        console.log("лево")
        
        maxResize.width = Math.min(maxResize.width, actualCoordinates.left)
      }
      if (newWidth < minWidth) {
        console.log("мин шир")
        
        maxResize.width = Math.min(maxResize.width, minWidth - actualCoordinates.width)
      } 
      if (newWidth > maxWidth) {
        console.log("макс шир")
        maxResize.width = Math.min(maxResize.width, maxWidth - actualCoordinates.width)
      }

      if (actualCoordinates.top + actualCoordinates.height + coefficient*directions.bottom > this.imageHeight) {
        maxResize.height = Math.min(maxResize.height, this.imageHeight - (actualCoordinates.top + actualCoordinates.height))
      }
      if (actualCoordinates.top - coefficient*directions.top < 0) {
        maxResize.height = Math.min(maxResize.height, actualCoordinates.top)
      } 
      if (newHeight < minHeight) {
        maxResize.height = Math.min(maxResize.height, minHeight - actualCoordinates.height)
      } 
      if (newHeight > maxHeight) {
        maxResize.height = Math.min(maxResize.height, maxHeight - actualCoordinates.height)
      }

      console.log(maxResize)

      if (maxResize.width !== Infinity && (directions.right + directions.left) ) {
        const multiplier = maxResize.width / ((directions.right + directions.left)* coefficient)
        const horizontalDirections = ['left', 'right']
        horizontalDirections.forEach(direction => {
          directions[direction] *= multiplier
        })
      }

      if (maxResize.height !== Infinity && (directions.bottom + directions.top) ) {
        const multiplier = maxResize.height / ((directions.bottom + directions.top) * coefficient)
        const verticalDirections = ['top', 'bottom']
        verticalDirections.forEach(direction => {
          directions[direction] *= multiplier
        })
      }

      newWidth = actualCoordinates.width + coefficient*(directions.left + directions.right)
      newHeight = actualCoordinates.height + coefficient*(directions.top + directions.bottom)


      // Checks ratio:
      let ratioBroken = null;
      if (event.shiftKey) {
        ratioBroken = this.width / this.height
      }
      else if (this.aspectRatio && newWidth / newHeight !== this.aspectRatio) {
        ratioBroken = this.aspectRatio
      }
      else if (this.minAspectRatio && newWidth / newHeight < this.minAspectRatio) {
        ratioBroken = this.minAspectRatio
      }
      else if (this.maxAspectRatio && newWidth / newHeight > this.maxAspectRatio) {
        ratioBroken = this.maxAspectRatio
      }

      // Correct breaking aspect ratio
      if (ratioBroken) {
        const shifts = {...directions}
        if (Math.abs(newWidth / ratioBroken - newHeight) < Math.abs(newHeight * ratioBroken - newWidth)) {
          let overlapWidth = actualCoordinates.width - newWidth
          let overlapHeight = actualCoordinates.height - newWidth / ratioBroken
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
          //  else {
          //   directions.right = 0
          //   directions.top = 0
          //   directions.left = 0
          //   directions.bottom = 0
          // }
      }

      this.$emit('resize', directions)
    }
  },
  computed: {
    classes() {
      return {
        stencil: classnames(!this.disableDefaultClasses && cn(), this.classname),
        preview: classnames(!this.disableDefaultClasses && cn('preview'), this.previewClassname),
      };
    },
    pixelWidth() {
      return this.width * this.areaWidth
    },
    pixelHeight() {
      return this.height * this.areaHeight
    }
  }
};
</script>

<template>
  <div :class="classes.stencil"
    ref="stencil"
  >
    <BoundingBox @resize="onResize">
      <MoveableContainer @move="onMove" @resize="onResize">
        <PreviewImage 
          :img="img"
          :classname="classes.preview"
          :previewWidth="stencilWidth" 
          :previewHeight="stencilHeight"
          :width="width"
          :height="height"
          :left="left"
          :top="top"
        />
      </MoveableContainer>
    </BoundingBox>    
  </div>
</template>

<style lang="scss">
  .vue-rectangle-stencil {
    background: rgba(red, 0.1);
    height: 100%;
    width: 100%;
    cursor: move;
  }
</style>