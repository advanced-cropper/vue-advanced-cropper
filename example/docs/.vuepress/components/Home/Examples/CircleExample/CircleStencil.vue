<script>
import { DraggableElement, DraggableArea, StencilPreview, ResizeEvent } from 'vue-advanced-cropper';

export default {
	components: {
		StencilPreview,
		DraggableArea,
		DraggableElement,
	},
	props: {
		image: {
			type: Object,
		},
		coordinates: {
			type: Object,
		},
		transitions: {
			type: Object,
		},
		stencilCoordinates: {
			type: Object,
		},
	},
	computed: {
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
			const style = {
				width: `${width}px`,
				height: `${height}px`,
				transform: `translate(${left}px, ${top}px)`,
			};
			if (this.transitions && this.transitions.enabled) {
				style.transition = `${this.transitions.time}ms ${this.transitions.timingFunction}`;
			}
			return style;
		},
	},
	methods: {
		onMove(moveEvent) {
			this.$emit('move', moveEvent);
		},
		onMoveEnd() {
			this.$emit('move-end');
		},
		onResize(dragEvent) {
			const shift = dragEvent.shift();

			const widthResize = shift.left;
			const heightResize = -shift.top;

			this.$emit(
				'resize',
				new ResizeEvent(
					{
						left: widthResize,
						right: widthResize,
						top: heightResize,
						bottom: heightResize,
					},
					{
						compensate: true,
					},
				),
			);
		},
		onResizeEnd() {
			this.$emit('resize-end');
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
	<div class="circle-stencil" :style="style">
		<draggable-element class="circle-stencil__handler" @drag="onResize" @drag-end="onResizeEnd">
			<img :src="require('./assets/handler.svg')" @mousedown.prevent />
		</draggable-element>
		<draggable-area @move="onMove" @move-end="onMoveEnd">
			<stencil-preview
				class="circle-stencil__preview"
				:image="image"
				:coordinates="coordinates"
				:width="stencilCoordinates.width"
				:height="stencilCoordinates.height"
				:transitions="transitions"
			/>
		</draggable-area>
	</div>
</template>

<style lang="scss">
.circle-stencil {
	border-radius: 50%;
	cursor: move;
	position: absolute;
	border: dashed 2px white;
	box-sizing: border-box;
	&__icon {
		user-select: none;
		pointer-events: none;
	}
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
		user-drag: none;
	}
	&__preview {
		border-radius: 50%;
		overflow: hidden;
	}
}
</style>
