<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { replacedProp } from '../../core';
import { PreviewResult, BoundingBox, DraggableArea } from '../service';
import { SimpleHandler } from '../handlers';
import { SimpleLine } from '../lines';

const cn = bem('vue-rectangle-stencil');

export default {
	name: 'RectangleStencil',
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
		aspectRatio: {
			type: [Number, String],
		},
		minAspectRatio: {
			type: [Number, String],
		},
		maxAspectRatio: {
			type: [Number, String],
		},
		movable: {
			type: Boolean,
			default: true,
		},
		scalable: {
			type: Boolean,
			default: true,
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
	computed: {
		classes() {
			return {
				stencil: classnames(cn({ movable: this.movable }), this.classname),
				preview: classnames(cn('preview'), this.previewClass || this.previewClassname),
				boundingBox: classnames(cn('bounding-box'), this.boundingBoxClass || this.boundingBoxClassname),
			};
		},
		style() {
			const { height, width, left, top } = this.stencilCoordinates;
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
		onEndMove() {
			this.$emit('move-end');
		},
		onResize(resizeEvent) {
			this.$emit('resize', resizeEvent);
		},
		onEndResize() {
			this.$emit('resize-end');
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
	<div :class="classes.stencil" :style="style">
		<BoundingBox
			:class="classes.boundingBox"
			:handlers="handlers"
			:handler-component="handlerComponent"
			:handlers-classnames="handlersClassnames"
			:handlers-classes="handlersClasses"
			:lines="lines"
			:line-component="lineComponent"
			:lines-classnames="linesClassnames"
			:lines-classes="linesClasses"
			:scalable="scalable"
			@resize="onResize"
			@resize-end="onEndResize"
		>
			<DraggableArea :movable="movable" @move="onMove" @move-end="onEndMove">
				<PreviewResult :img="img" :class="classes.preview" :stencil-coordinates="stencilCoordinates" />
			</DraggableArea>
		</BoundingBox>
	</div>
</template>

<style lang="scss">
.vue-rectangle-stencil {
	position: absolute;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	&--movable {
		cursor: move;
	}
}
</style>
