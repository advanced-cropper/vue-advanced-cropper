<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { LineWrapper } from '../service';

const cn = bem('vue-simple-line');

export default {
	name: 'SimpleLine',
	components: {
		LineWrapper,
	},
	props: {
		classname: {
			type: String,
		},
		hoverClassname: {
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
				root: classnames(cn({ [this.position]: true }), this.classname, this.hover && this.hoverClassname),
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
	<LineWrapper :position="position" :disabled="disabled" @enter="onEnter" @leave="onLeave" @drag="onDrag">
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
		border-top-width: 1px;
	}
	&--north {
		border-bottom-width: 1px;
	}

	&--hover {
		opacity: 1;
		border-color: white;
	}
}
</style>
