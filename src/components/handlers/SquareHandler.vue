<script>
import classnames from "classnames";
import bem from "easy-bem";
import draggable from "../../mixins/draggable.js";
import { HandlerWrapper } from "../service";

const cn = bem("vue-square-handler");

export default {
  name: "SquareHandler",
  components: {
    HandlerWrapper
  },
  props: {
    classname: {
      type: String
    },
    horizontalPosition: {
      type: String
    },
    verticalPosition: {
      type: String
    }
  },
  computed: {
    classnames() {
      return {
        default: classnames(cn(), this.classname)
      };
    }
  },
  methods: {
    onDrag(dragEvent) {
      this.$emit("drag", dragEvent);
    }
  }
};
</script>

<template>
  <HandlerWrapper 
    @drag="this.onDrag"
    :verticalPosition="verticalPosition"
    :horizontalPosition="horizontalPosition"
  >
    <div :class="classnames.default"></div>
  </HandlerWrapper>
</template>

<style lang="scss">
.vue-square-handler {
  display: block;
  background: white;
  height: 10px;
  width: 10px;
}
</style>