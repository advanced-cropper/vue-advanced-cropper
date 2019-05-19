<script>
import classnames from "classnames";
import bem from "easy-bem";
import { PreviewImage, BoundingBox, DraggableArea } from "../service";
import { SquareHandler } from "../handlers";
import { DefaultLine } from "../lines";

const cn = bem("vue-rectangle-stencil");

export default {
  name: "RectangleStencil",
  components: {
    PreviewImage,
    BoundingBox,
    DraggableArea
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
    stencilLeft: {
      type: Number
    },
    stencilTop: {
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
    handlers: {
      type: Object
    },
    handlerComponent: {
      type: [Object, String],
      default() {
        return SquareHandler;
      }
    },
    handlersClassnames: {
      type: Object,
      default() {
        return {};
      }
    },
    lines: {
      type: Object
    },
    lineComponent: {
      type: [Object, String],
      default() {
        return DefaultLine;
      }
    },
    linesClassnames: {
      type: Object,
      default() {
        return {};
      }
    },
    classname: {
      type: String
    },
    previewClassname: {
      type: String
    },
    boundingBoxClassname: {
      type: String
    },
    type: {
      type: String,
      default: "RectangleStencil"
    },
    aspectRatio: {
      type: [Number, String]
    },
    minAspectRatio: {
      type: [Number, String]
    },
    maxAspectRatio: {
      type: [Number, String]
    }
  },
  methods: {
    onMove(moveEvent) {
      this.$emit("move", moveEvent);
    },
    onResize(resizeEvent) {
      this.$emit("resize", resizeEvent);
    },
    aspectRatios() {
      return {
        minimum: this.aspectRatio || this.minAspectRatio,
        maximum: this.aspectRatio || this.maxAspectRatio
      };
    }
  },
  computed: {
    classes() {
      return {
        stencil: classnames(cn(), this.classname),
        preview: classnames(cn("preview"), this.previewClassname)
      };
    },
    style() {
      return {
        width: `${this.stencilWidth}px`,
        height: `${this.stencilHeight}px`,
        left: `${this.stencilLeft}px`,
        top: `${this.stencilTop}px`
      };
    }
  }
};
</script>

<template>
  <div :class="classes.stencil" :style="style">
    <BoundingBox 
      @resize="onResize"
      :classname="boundingBoxClassname"
      :handlers="handlers"
      :handlerComponent="handlerComponent"
      :handlersClassnames="handlersClassnames"
      :lines="lines"
      :lineComponent="lineComponent"
      :linesClassnames="linesClassnames"
    >
      <DraggableArea @move="onMove" @resize="onResize">
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
      </DraggableArea>
    </BoundingBox>    
  </div>
</template>

<style lang="scss">
.vue-rectangle-stencil {
  position: absolute;
  background: rgba(red, 0.1);
  height: 100%;
  width: 100%;
  cursor: move;
}
</style>