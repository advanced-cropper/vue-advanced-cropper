<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import {PreviewImage,BoundingBox, DraggableArea} from '../service';


const cn = bem('vue-circle-stencil')

export default {
	name: 'CircleStencil',
	components: {
		PreviewImage, BoundingBox, DraggableArea
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
	computed: {
		classes() {
			return {
				stencil: classnames(cn(), this.classname),
				preview: classnames(cn('preview'), this.previewClassname),
			};
		},
		pixelWidth() {
			return this.width * this.areaWidth
		},
		pixelHeight() {
			return this.height * this.areaHeight
		}
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
	}
};
</script>

<template>
  <div
    ref="stencil"
    :class="classes.stencil"
  >
    <BoundingBox
      :handlers="handlers"
      :handler-component="handlerComponent"
      :handler-classnames="handlerClassnames"
      @resize="onResize"
    >
      <DraggableArea
        @move="onMove"
        @resize="onResize"
      >
        <PreviewImage
          :img="img"
          :classname="classes.preview"
          :preview-width="stencilWidth"
          :preview-height="stencilHeight"
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
  .vue-circle-stencil {
    background: rgba(red, 0.1);
    height: 100%;
    width: 100%;
    cursor: move;
  }
</style>
