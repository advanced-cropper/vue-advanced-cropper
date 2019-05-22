<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { directionNames } from '../../utils/core.js';
import DraggableElement from './DraggableElement.vue';

const cn = bem('vue-handler-wrapper');

const HORIZONTAL_DIRECTIONS = ['east', 'west', null];
const VERTICAL_DIRECTIONS = ['south', 'north', null];

export default {
	name: 'HandlerWrapper',
	components: {
		DraggableElement
	},
	props: {
		horizontalPosition: {
			type: String
		},
		verticalPosition: {
			type: String
		},
		classname: {
			type: String
		}
	},
	computed: {
		classnames() {
			let defaultClassname;
			if (this.horizontalPosition || this.verticalPosition) {
				const position = directionNames(
					this.horizontalPosition,
					this.verticalPosition
				);
				defaultClassname = classnames(this.classname, cn({ [position.classname]: true }));
			} else {
				defaultClassname = classnames(this.classname, cn());
			}
			return {
				default: defaultClassname,
				draggable: cn('draggable')
			}
		}
	}
};
</script>

<template>
  <div :class="classnames.default">
    <DraggableElement
      :class="classnames.draggable"
      @drag="$emit('drag', $event)"
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
}
</style>
