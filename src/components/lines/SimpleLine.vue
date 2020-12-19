<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { LineWrapper } from '../service';

const block = bem('vue-simple-line');
const wrapper = bem('vue-simple-line-wrapper');

export default {
	name: 'SimpleLine',
	components: {
		LineWrapper,
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
		position: {
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
			return {
				root: classnames(block({ [this.position]: true }), this.defaultClass, this.hover && this.hoverClass),
				wrapper: classnames(wrapper({ [this.position]: true }), this.wrapperClass),
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
	<LineWrapper
		:class="classes.wrapper"
		:position="position"
		:disabled="disabled"
		@drag="onDrag"
		@drag-end="onDragEnd"
		@enter="onEnter"
		@leave="onLeave"
	>
		<div :class="classes.root" />
	</LineWrapper>
</template>

<style lang="scss">
.vue-simple-line {
	background: none;
	transition: border 0.5s;
	border-color: rgba(white, 0.3);
	border-width: 0;
	border-style: solid;

	&--south,
	&--north {
		height: 0;
		width: 100%;
	}

	&--east,
	&--west {
		height: 100%;
		width: 0;
	}

	&--east {
		border-right-width: 1px;
	}
	&--west {
		border-left-width: 1px;
	}
	&--south {
		border-bottom-width: 1px;
	}
	&--north {
		border-top-width: 1px;
	}

	&--hover {
		opacity: 1;
		border-color: white;
	}
}
</style>
