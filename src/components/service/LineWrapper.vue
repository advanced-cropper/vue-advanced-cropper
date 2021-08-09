<script>
import bem from 'easy-bem';
import DraggableElement from './DraggableElement.vue';

const cn = bem('vue-line-wrapper');

export default {
	name: 'LineWrapper',
	components: {
		DraggableElement,
	},
	props: {
		position: {
			type: String,
			required: true,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		classname() {
			return cn({ [this.position]: true, disabled: this.disabled });
		},
	},
};
</script>

<template>
	<DraggableElement
		:class="classname"
		@drag="$emit('drag', $event)"
		@drag-end="$emit('drag-end')"
		@leave="$emit('leave')"
		@enter="$emit('enter')"
	>
		<slot />
	</DraggableElement>
</template>

<style lang="scss">
.vue-line-wrapper {
	background: none;
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;

	&--north,
	&--south {
		height: 12px;
		width: 100%;
		left: 0;
		transform: translateY(-50%);
	}
	&--north {
		top: 0;
		cursor: n-resize;
	}
	&--south {
		top: 100%;
		cursor: s-resize;
	}

	&--east,
	&--west {
		width: 12px;
		height: 100%;
		transform: translateX(-50%);
		top: 0;
	}
	&--east {
		left: 100%;
		cursor: e-resize;
	}
	&--west {
		left: 0;
		cursor: w-resize;
	}
	&--disabled {
		cursor: auto;
	}
}
</style>
