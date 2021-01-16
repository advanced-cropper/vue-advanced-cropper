<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { BoundingBox, DraggableArea, StencilPreview } from '../service';
import { SimpleHandler } from '../handlers';
import { SimpleLine } from '../lines';

const cn = bem('vue-circle-stencil');

export default {
	components: {
		StencilPreview,
		BoundingBox,
		DraggableArea,
	},
	props: {
		image: {
			type: Object,
		},
		coordinates: {
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
		handlersComponent: {
			type: [Object, String],
			default() {
				return SimpleHandler;
			},
		},
		handlersClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		handlersWrappersClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		lines: {
			type: Object,
		},
		linesComponent: {
			type: [Object, String],
			default() {
				return SimpleLine;
			},
		},
		linesClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		linesWrappersClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		movable: {
			type: Boolean,
			default: true,
		},
		resizable: {
			type: Boolean,
			default: true,
		},
		transitions: {
			type: Object,
		},
		movingClass: {
			type: String,
		},
		resizingClass: {
			type: String,
		},
		previewClass: {
			type: String,
		},
		boundingBoxClass: {
			type: String,
		},
	},
	data() {
		return {
			moving: false,
			resizing: false,
		};
	},
	computed: {
		classes() {
			return {
				stencil: classnames(
					cn({ movable: this.movable, moving: this.moving, resizing: this.resizing }),
					this.moving && this.movingClass,
					this.resizing && this.resizingClass,
				),
				preview: classnames(cn('preview'), this.previewClass),
				boundingBox: classnames(cn('bounding-box'), this.boundingBoxClass),
			};
		},
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
			this.moving = true;
		},
		onMoveEnd() {
			this.$emit('move-end');
			this.moving = false;
		},
		onResize(resizeEvent) {
			this.$emit('resize', resizeEvent);
			this.resizing = true;
		},
		onResizeEnd() {
			this.$emit('resize-end');
			this.resizing = false;
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
	<div :class="classes.stencil" :style="style">
		<bounding-box
			:width="stencilCoordinates.width"
			:height="stencilCoordinates.height"
			:transitions="transitions"
			:class="classes.boundingBox"
			:handlers="handlers"
			:handlers-component="handlersComponent"
			:handlers-classes="handlersClasses"
			:handlers-wrappers-classes="handlersWrappersClasses"
			:lines="lines"
			:lines-component="linesComponent"
			:lines-classes="linesClasses"
			:lines-wrappers-classes="linesWrappersClasses"
			:resizable="resizable"
			@resize="onResize"
			@resize-end="onResizeEnd"
		>
			<draggable-area :movable="movable" @move="onMove" @move-end="onMoveEnd">
				<stencil-preview
					:image="image"
					:coordinates="coordinates"
					:width="stencilCoordinates.width"
					:height="stencilCoordinates.height"
					:class="classes.preview"
					:transitions="transitions"
				/>
			</draggable-area>
		</bounding-box>
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
		position: absolute;
		width: 100%;
		height: 100%;
	}
	&--movable {
		cursor: move;
	}
}
</style>
