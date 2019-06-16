<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { PreviewResult, BoundingBox, DraggableArea } from '../service';
import { SimpleHandler } from '../handlers';
import { SimpleLine } from '../lines';

const cn = bem('vue-round-stencil');

export default {
	name: 'RoundStencil',
	components: {
		PreviewResult,
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
			type: Object,
			default() {
				return {
					eastNorth: true,
					westNorth: true,
					westSouth: true,
					eastSouth: true,
				}
			}
		},
		handlerComponent: {
			type: [Object, String],
			default() {
				return SimpleHandler;
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
				return SimpleLine;
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
	},
	methods: {
		onMove(moveEvent) {
			this.$emit('move', moveEvent);
		},
		onResize(resizeEvent) {
			this.$emit('resize', resizeEvent);
		},
		aspectRatios() {
			return {
				minimum: 1,
				maximum: 1
			};
		}
	},
	computed: {
		classes() {
			return {
				stencil: classnames(cn(), this.classname),
				preview: classnames(cn('preview'), this.previewClassname),
				boundingBox: classnames(cn('bounding-box'), this.boundingBox),
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
      :classname="classes.boundingBox"
      :handlers="handlers"
      :handlerComponent="handlerComponent"
      :handlersClassnames="handlersClassnames"
      :lines="lines"
      :lineComponent="lineComponent"
      :linesClassnames="linesClassnames"
    >
      <DraggableArea @move="onMove">
        <PreviewResult
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
.vue-round-stencil {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: content-box;
  cursor: move;
  &__preview {
	  border-radius: 50%;
	  //position: absolute;
  }
  &__bounding-box {
	//   border-radius: 50%;
	//   position: relative;
	//   height: 100%;
	//   width: 100%;
  }
}
</style>
