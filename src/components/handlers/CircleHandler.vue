<script>
import classnames from "classnames";
import bem from "easy-bem";
import draggable from "../../mixins/draggable.js";

const cn = bem("vue-circle-handler");

export default {
  name: "CircleHandler",
  mixins: [draggable],
  props: {
    classname: {
      type: String
    }
  },
  computed: {
    classnames() {
      return {
        default: classnames(!this.disableDefaultClasses && cn(), this.classname)
      };
    }
  }
};
</script>

<template>
  <div 
    ref="draggable" 
    :class="classnames.default" 
    @touchstart="this.onTouchStart"
    @mousedown="this.onMouseDown"
  >
  </div>
</template>

<style lang="scss">
.vue-circle-handler {
  width: 30px;
  height: 30px;
  &:after {
    content: "";
    display: block;
    background: white;
    border-radius: 50%;
    height: 10px;
    width: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>