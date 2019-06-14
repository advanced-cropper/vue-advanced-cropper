<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import {
	DraggableElement,
	DraggableArea,
	PreviewImage,
} from 'vue-advanced-cropper';

const BORDER_WIDTH = 2;

const cn = bem('circle-stencil')

export default {
	name: 'CircleStencil',
	components: {
		PreviewImage,
		DraggableArea,
		DraggableElement
	},
	props: {
		img: {
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
		}
	},
	data() {
		return {
			cn
		}
	},
	computed: {
		style() {
			return {
				width: `${this.stencilWidth}px`,
				height: `${this.stencilHeight}px`,
				left: `${this.stencilLeft - BORDER_WIDTH}px`,
				top: `${this.stencilTop - BORDER_WIDTH}px`
			};
		}
	},
	methods: {
		onMove(moveEvent) {
			this.$emit('move', moveEvent);
		},
		onHandlerMove(dragEvent) {
			const { position, anchor, element } = dragEvent;
			const { left, right, bottom, top } = element.getBoundingClientRect();

			const widthResize = position.left - left - anchor.left
			const heightResize = top - position.top + anchor.top

			const resize = (widthResize + heightResize) / 2

			this.$emit('resize', {
				nativeEvent: dragEvent.nativeEvent,
				directions: {
					left: resize,
					right: resize,
					top: resize,
					bottom: resize,
				}
			});
		},
		aspectRatios() {
			return {
				minimum: 1,
				maximum: 1
			};
		}
	}
};
</script>

<template>
  <div
    :class="cn()"
    :style="style"
  >
    <DraggableElement
      :classname="cn('handler')"
      @drag="onHandlerMove"
    >
      <img
        :src="require('./assets/handler.svg')"
        alt=""
      >
    </DraggableElement>
    <DraggableArea @move="onMove">
      <PreviewImage
        :img="img"
        :classname="cn('preview')"
        :preview-width="stencilWidth"
        :preview-height="stencilHeight"
        :width="width"
        :height="height"
        :left="left"
        :top="top"
      />
    </DraggableArea>
  </div>
</template>

<style lang="scss">
.circle-stencil {
  border-radius: 50%;
  cursor: move;
  position: absolute;
  border: dashed 2px white;
  box-sizing: content-box;

  &__handler {
    position: absolute;
    right: 15%;
    top: 14%;
    z-index: 1;
    cursor: ne-resize;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(50%, -50%);
  }
  &__preview {
    border-radius: 50%;
    overflow: hidden;
  }
}
</style>
