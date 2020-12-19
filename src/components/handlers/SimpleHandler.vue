<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { HandlerWrapper } from '../service';

const block = bem('vue-simple-handler');
const wrapper = bem('vue-simple-handler-wrapper');

export default {
	name: 'SimpleHandler',
	components: {
		HandlerWrapper,
	},
	props: {
		defaultClass: {
			type: String,
		},
		hoverClass: {
			type: String,
		},
		wrapperClass: {
			type: String,
		},
		horizontalPosition: {
			type: String,
		},
		verticalPosition: {
			type: String,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			hover: false,
		};
	},
	computed: {
		classes() {
			const options = {
				[this.horizontalPosition]: Boolean(this.horizontalPosition),
				[this.verticalPosition]: Boolean(this.verticalPosition),
				[`${this.horizontalPosition}-${this.verticalPosition}`]: Boolean(
					this.verticalPosition && this.horizontalPosition,
				),
				hover: this.hover,
			};
			return {
				default: classnames(block(options), this.defaultClass, this.hover && this.hoverClass),
				wrapper: classnames(wrapper(options), this.wrapperClass),
			};
		},
	},
	methods: {
		onDrag(dragEvent) {
			this.$emit('drag', dragEvent);
		},
		onEnter() {
			this.hover = true;
		},
		onLeave() {
			this.hover = false;
		},
		onDragEnd() {
			this.$emit('drag-end');
		},
	},
};
</script>

<template>
	<HandlerWrapper
		:class="classes.wrapper"
		:vertical-position="verticalPosition"
		:horizontal-position="horizontalPosition"
		:disabled="disabled"
		@drag="onDrag"
		@drag-end="onDragEnd"
		@enter="onEnter"
		@leave="onLeave"
	>
		<div :class="classes.default" />
	</HandlerWrapper>
</template>

<style lang="scss">
.vue-simple-handler {
	display: block;
	background: white;
	height: 10px;
	width: 10px;
}
</style>
