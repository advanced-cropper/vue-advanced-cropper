<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { directionNames } from '../../core/utils';
import DraggableElement from './DraggableElement.vue';

const cn = bem('vue-handler-wrapper');

export default {
	name: 'HandlerWrapper',
	components: {
		DraggableElement,
	},
	props: {
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
	computed: {
		classes() {
			let rootClass;
			if (this.horizontalPosition || this.verticalPosition) {
				const position = directionNames(this.horizontalPosition, this.verticalPosition);
				rootClass = cn({ [position.classname]: true, disabled: this.disabled });
			} else {
				rootClass = cn({ disabled: this.disabled });
			}
			return {
				root: rootClass,
				draggable: cn('draggable'),
			};
		},
	},
};
</script>

<template>
	<div :class="classes.root">
		<DraggableElement
			:class="classes.draggable"
			@drag="$emit('drag', $event)"
			@drag-end="$emit('drag-end')"
			@leave="$emit('leave')"
			@enter="$emit('enter')"
		>
			<slot />
		</DraggableElement>
	</div>
</template>

<style lang="scss">
.vue-handler-wrapper {
	position: absolute;
	transform: translate(-50%, -50%);
	width: 30px;
	height: 30px;
	&__draggable {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&--west-north {
		cursor: nw-resize;
	}
	&--north {
		cursor: n-resize;
	}
	&--east-north {
		cursor: ne-resize;
	}
	&--east {
		cursor: e-resize;
	}
	&--east-south {
		cursor: se-resize;
	}
	&--south {
		cursor: s-resize;
	}
	&--west-south {
		cursor: sw-resize;
	}
	&--west {
		cursor: w-resize;
	}
	&--disabled {
		cursor: auto;
	}
}
</style>
