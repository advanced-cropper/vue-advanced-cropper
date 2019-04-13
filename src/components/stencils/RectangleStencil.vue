<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import PreviewImage from '../service/PreviewImage.vue';
import BoundingBox from '../service/BoundingBox.vue';
import dragStencil from '../../mixins/dragStencil.js'
import resizeStencil from '../../mixins/resizeStencil.js'

const cn = bem('vue-rectangle-stencil')

export default {
  mixins: [
    dragStencil, resizeStencil
  ],
  name: "RectangleStencil",
  components: {
    PreviewImage, BoundingBox
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
    @touchstart="this.onTouchStart"
    @mousedown="this.onMouseDown"
    ref="stencil"
  >
    <BoundingBox @change="onResize">
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
    </BoundingBox>    
    <canvas ref="canvas"/>
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