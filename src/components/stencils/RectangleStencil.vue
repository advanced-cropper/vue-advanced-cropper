<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import {PreviewImage,BoundingBox, MoveableArea} from '../service';


const cn = bem('vue-rectangle-stencil')

export default {
  name: "RectangleStencil",
  components: {
    PreviewImage, BoundingBox, MoveableArea
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
    handlers: {
      type: Object
    },
    handlerComponent: {
      type: [Object, String],
    },
    handlerClassnames: {
      type: Object,
      default() {
        return {}
      },
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
  },
  methods: {
    onMove(moveEvent) {
      this.$emit('move', moveEvent)
    },
    onResize(resizeEvent) {
      this.$emit('resize', resizeEvent)
    },
    aspectRatios() {
      return {
          minimum: this.aspectRatio || this.minAspectRatio,
          maximum: this.aspectRatio || this.maxAspectRatio,
        }
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
    <BoundingBox 
      @resize="onResize"
      :handlers="handlers"
      :handlerComponent="handlerComponent"
      :handlerClassnames="handlerClassnames"
    >
      <MoveableArea @move="onMove" @resize="onResize">
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
      </MoveableArea>
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