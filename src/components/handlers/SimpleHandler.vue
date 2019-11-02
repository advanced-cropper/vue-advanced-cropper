<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { HandlerWrapper } from '../service';

const cn = bem('vue-square-handler');

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
		}
	},
	computed: {
		classnames() {
			return {
				default: classnames(
					cn({ [this.position]: true, }),
					this.classname,
					this.hover && this.hoverClassname
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
	},
};
</script>

<template>
  <HandlerWrapper
    :vertical-position="verticalPosition"
    :horizontal-position="horizontalPosition"
    :disabled="disabled"
    @drag="onDrag"
  >
    <div :class="classnames.default" />
  </HandlerWrapper>
</template>

<style lang="scss">
.vue-square-handler {
  display: block;
  background: white;
  height: 10px;
  width: 10px;
}
</style>
