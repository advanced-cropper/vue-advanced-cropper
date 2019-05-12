<script>
import classnames from "classnames";
import bem from "easy-bem";
import { directionNames } from "../../utils/core.js";
import draggable from "../../mixins/draggable";

const cn = bem("vue-handler-wrapper");

const HORIZONTAL_DIRECTIONS = ["east", "west", null];
const VERTICAL_DIRECTIONS = ["south", "north", null];

export default {
  name: "handler-wrapper",
  mixins: [draggable],
  props: {
    horizontalPosition: {
      type: String
    },
    verticalPosition: {
      type: String
    }
  },
  computed: {
    classname() {
      if (this.horizontalPosition || this.verticalPosition) {
        const position = directionNames(
          this.horizontalPosition,
          this.verticalPosition
        );
        return cn({ [position.className]: true });
      } else {
        return cn();
      }
    }
  }
};
</script>

<template>
  <div 
	ref="draggable"
	@touchstart="this.onTouchStart"
  @mousedown="this.onMouseDown"
	:class="classname"
  >
	<slot></slot>
  </div>
</template>

<style lang="scss">
.vue-handler-wrapper {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transform: translate(-50%, -50%);
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