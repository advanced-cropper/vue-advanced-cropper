<script>
import classnames from "classnames";
import bem from "easy-bem";
import { directionNames } from "../../utils/core.js";
import draggable from "../../mixins/draggable";

const cn = bem("vue-line-wrapper");

const HORIZONTAL_DIRECTIONS = ["east", "west", null];
const VERTICAL_DIRECTIONS = ["south", "north", null];

export default {
  name: "line-wrapper",
  mixins: [draggable],
  props: {
    position: {
      type: String,
      required: true
    }
  },
  computed: {
    classname() {
      return cn({ [this.position]: true });
    }
  }
};
</script>

<template>
  <div 
	ref="draggable"
	@mouseover="this.onMouseOver"
	@mouseleave="this.onMouseLeave"
    @mousedown="this.onMouseDown"
	@touchstart="this.onTouchStart"
	:class="classname"
  >
	<slot></slot>
  </div>
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
}
</style>