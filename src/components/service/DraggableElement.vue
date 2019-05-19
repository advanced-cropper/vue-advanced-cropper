<script>
import bem from "easy-bem";
import draggable from "../../mixins/draggable";
import classnames from 'classnames';

const cn = bem("vue-draggable-element");

export default {
  name: "draggable-element",
  mixins: [draggable],
  props: {
    classname: {
      type: String
    }
  },
};
</script>

<template>
  <div 
	ref="draggable"
	@touchstart="this.onTouchStart"
  @mousedown="this.onMouseDown"
	@mouseover="this.onMouseOver"
	@mouseleave="this.onMouseLeave"
	:class="classname"
  >
	<slot></slot>
  </div>
</template>

<style lang="scss">
.vue-draggable-element {
  position: relative;
}
</style>