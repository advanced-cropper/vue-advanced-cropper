<script>
import bem from 'easy-bem';
import classnames from 'classnames';
import { replacedProp } from '../../core';
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
		// Deprecated props:
		classname: {
			type: String,
			validator(value) {
				return replacedProp(value, 'classname', 'class');
			},
		},
	},
	computed: {
		classes() {
			let rootClass;
			if (this.horizontalPosition || this.verticalPosition) {
				const position = directionNames(this.horizontalPosition, this.verticalPosition);
				rootClass = classnames(this.classname, cn({ [position.classname]: true, disabled: this.disabled }));
			} else {
				rootClass = classnames(this.classname, cn({ disabled: this.disabled }));
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
			:disabled="disabled"
			@drag="$emit('drag', $event)"
			@end="$emit('drag-end')"
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
	&__draggable {
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	&--west-north {
		left: 0;
		top: 0;
		cursor: nw-resize;
	}
	&--north {
		left: 50%;
		top: 0;
		cursor: n-resize;
	}
	&--east-north {
		left: 100%;
		top: 0;
		cursor: ne-resize;
	}
	&--east {
		left: 100%;
		top: 50%;
		cursor: e-resize;
	}
	&--east-south {
		left: 100%;
		top: 100%;
		cursor: se-resize;
	}
	&--south {
		left: 50%;
		top: 100%;
		cursor: s-resize;
	}
	&--west-south {
		left: 0;
		top: 100%;
		cursor: sw-resize;
	}
	&--west {
		left: 0;
		top: 50%;
		cursor: w-resize;
	}
	&--disabled {
		cursor: auto;
	}
}
</style>
