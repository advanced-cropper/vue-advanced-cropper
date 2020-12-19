<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { replacedProp } from '../../core';
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
		lines: {
			type: Object,
		},
		lineComponent: {
			type: [Object, String],
			default() {
				return SimpleLine;
			},
		},
		movable: {
			type: Boolean,
			default: true,
		},
		scalable: {
			type: Boolean,
			default: true,
		},
		transitions: {
			type: Object,
		},
		previewClass: {
			type: String,
		},
		boundingBoxClass: {
			type: String,
		},
		linesClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		handlersClasses: {
			type: Object,
			default() {
				return {};
			},
		},
		// Deprecated props
		classname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'classname', 'class');
			},
		},
		previewClassname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'previewClassname', 'previewClass');
			},
		},
		boundingBoxClassname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'boundingBoxClassname', 'boundingBoxClass');
			},
		},
		linesClassnames: {
			type: Object,
			validator(value) {
				return replacedProp(value, 'linesClassnames', 'linesClasses');
			},
		},
		handlersClassnames: {
			type: Object,
			validator(value) {
				return replacedProp(value, 'handlersClassnames', 'handlersClasses');
			},
		},
	},
	data() {
		return {
			dragging: false,
		};
	},
	computed: {
		classes() {
			return {
				stencil: classnames(
					cn({ movable: this.movable, dragging: this.dragging }),
					this.classname,
					this.dragging && this.draggingClass,
				),
				preview: classnames(cn('preview'), this.previewClass || this.previewClassname),
				boundingBox: classnames(cn('bounding-box'), this.boundingBoxClass || this.boundingBoxClassname),
			};
		},
		style() {
			const { height, width, left, top } = this.stencilCoordinates;

			const style = {
				width: `${width}px`,
				height: `${height}px`,
				left: `${left}px`,
				top: `${top}px`,
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
			this.dragging = true;
		},
		onMoveEnd() {
			this.$emit('move-end');
			this.dragging = false;
		},
		onResize(resizeEvent) {
			this.$emit('resize', resizeEvent);
			this.dragging = true;
		},
		onResizeEnd() {
			this.$emit('resize-end');
			this.dragging = false;
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
		<BoundingBox
			:class="classes.boundingBox"
			:handlers="handlers"
			:handler-component="handlerComponent"
			:handlers-classes="handlersClasses"
			:handlers-classnames="handlersClassnames"
			:handlers-wrappers-classes="handlersWrappersClasses"
			:lines="lines"
			:line-component="lineComponent"
			:lines-classes="linesClasses"
			:lines-classnames="linesClassnames"
			:lines-wrappers-classes="linesWrappersClasses"
			:scalable="scalable"
			@resize="onResize"
			@resize-end="onResizeEnd"
		>
			<DraggableArea :movable="movable" @move="onMove" @move-end="onMoveEnd">
				<PreviewResult
					:img="img"
					:transitions="transitions"
					:class="classes.preview"
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
