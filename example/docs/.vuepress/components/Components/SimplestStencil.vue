<script>
import { StencilPreview, BoundingBox, DraggableArea } from 'vue-advanced-cropper';

export default {
	components: {
		StencilPreview,
		BoundingBox,
		DraggableArea,
	},
	props: [
		// Image object
		'image',
		// Actual coordinates of the cropped fragment
		'coordinates',
		// Stencil size desired by cropper
		'stencilCoordinates',
		// Aspect ratios
		'aspectRatio',
		'minAspectRatio',
		'maxAspectRatio',
		// Transitions:
		'transitions',
	],
	computed: {
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
			const style = {
				position: 'absolute',
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
			this.$emit('moveEnd');
		},
		onResize(resizeEvent) {
			this.$emit('resize', resizeEvent);
		},
		onResizeEnd() {
			this.$emit('resizeEnd');
		},
		aspectRatios() {
			return {
				minimum: this.aspectRatio || this.minAspectRatio,
				maximum: this.aspectRatio || this.maxAspectRatio,
			};
		},
	},
};
</script>

<template>
	<div :style="style">
		<bounding-box @resize="onResize" @resize-end="onMoveEnd">
			<draggable-area @move="onMove" @move-end="onMoveEnd">
				<stencil-preview
					:image="image"
					:width="stencilCoordinates.width"
					:height="stencilCoordinates.height"
					:coordinates="coordinates"
					:transitions="transitions"
				/>
			</draggable-area>
		</bounding-box>
	</div>
</template>
