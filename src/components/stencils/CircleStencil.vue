<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { PreviewResult, BoundingBox, DraggableArea } from '../service';
import { SimpleHandler } from '../handlers';
import { SimpleLine } from '../lines';

const cn = bem('vue-circle-stencil');

export default {
	name: 'CircleStencil',
	components: {
		PreviewResult,
		BoundingBox,
		DraggableArea,
	},
	props: {
		img: {
			type: Object,
		},
		stencilClass: {
			type: String,
		},
		resultCoordinates: {
			type: Object,
		},
		stencilCoordinates: {
			type: Object,
		},
		handlers: {
			type: Object,
			default() {
				return {
					eastNorth: true,
					westNorth: true,
					westSouth: true,
					eastSouth: true,
				};
			},
		},
		handlerComponent: {
			type: [Object, String],
			default() {
				return SimpleHandler;
			},
		},
		handlersClassnames: {
			type: Object,
			default() {
				return {};
			},
		},
		lines: {
			type: Object,
		},
		lineComponent: {
			type: [Object, String],
			default() {
				return SimpleLine;
			},
		},
		linesClassnames: {
			type: Object,
			default() {
				return {};
			},
		},
		classname: {
			type: String,
		},
		previewClassname: {
			type: String,
		},
		boundingBoxClassname: {
			type: String,
		},
		movable: {
			type: Boolean,
			default: true,
		},
		scalable: {
			type: Boolean,
			default: true,
		},
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
			const { height, width, left, top, } = this.stencilCoordinates;
			return {
				width: `${width}px`,
				height: `${height}px`,
				left: `${left}px`,
				top: `${top}px`,
			};
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
				maximum: 1,
			};
		},
	},
};
</script>

<template>
  <div
    :class="classes.stencil"
    :style="style"
  >
    <BoundingBox
      :classname="classes.boundingBox"
      :handlers="handlers"
      :handler-component="handlerComponent"
      :handlers-classnames="handlersClassnames"
      :lines="lines"
      :line-component="lineComponent"
      :lines-classnames="linesClassnames"
      :scalable="scalable"
      @resize="onResize"
    >
      <DraggableArea
        :movable="movable"
        @move="onMove"
      >
        <PreviewResult
          :img="img"
          :classname="classes.preview"
          :result-coordinates="resultCoordinates"
          :stencil-coordinates="stencilCoordinates"
        />
      </DraggableArea>
    </BoundingBox>
  </div>
</template>

<style lang="scss">
.vue-circle-stencil {
  position: absolute;
  height: 100%;
  width: 100%;
  box-sizing: content-box;
  cursor: move;
  &__preview {
		border-radius: 50%;
  }
}
</style>
