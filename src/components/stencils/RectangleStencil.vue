<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import PreviewImage from '../service/PreviewImage.vue';
import BoundingBox from '../service/BoundingBox.vue';
import MoveableContainer from '../service/MoveableContainer.vue';

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
    }
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
      this.$emit('resize', resizeEvent)
      return
      
      const resize = resizeEvent.directions
      const event = resizeEvent.nativeEvent;
      const coefficient = this.width / this.stencilWidth

      this.$emit('change', {
        width: this.width + coefficient * (resize.right + resize.left),
        height: this.height + coefficient * (resize.top + resize.bottom),
        left: this.left - coefficient * resize.left,
        top: this.top - coefficient * resize.top
      })
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