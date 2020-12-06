<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { HandlerWrapper } from '../service';

const cn = bem('vue-simple-handler');

export default {
	name: 'SimpleHandler',
	components: {
		HandlerWrapper,
	},
	props: {
		classname: {
			type: String,
		},
		hoverClassname: {
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
		classnames() {
			return {
				default: classnames(
					cn({
						[this.horizontalPosition]: Boolean(this.horizontalPosition),
						[this.verticalPosition]: Boolean(this.verticalPosition),
						[`${this.horizontalPosition}-${this.verticalPosition}`]: Boolean(
							this.verticalPosition && this.horizontalPosition,
						),
						hover: this.hover,
					}),
					this.classname,
					this.hover && this.hoverClassname,
				),
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
		:vertical-position="verticalPosition"
		:horizontal-position="horizontalPosition"
		:disabled="disabled"
		@drag="onDrag"
		@drag-end="onDragEnd"
		@enter="onEnter"
		@leave="onLeave"
	>
		<div :class="classnames.default" />
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
