<script>
import classnames from "classnames";
import bem from "easy-bem";
import draggable from "../../mixins/draggable.js";
import { LineWrapper } from "../service";

const cn = bem("vue-default-line");

export default {
  name: "DefaultLine",
  components: {
    LineWrapper
  },
  props: {
    classname: {
      type: String
    },
    hoverClassname: {
      type: String
    },
    position: {
      type: String
    }
  },
  data() {
    return {
      hover: false
    };
  },
  computed: {
    classnames() {
      return {
        default: classnames(
          cn({ [this.position]: true }),
          this.classname,
          this.hover && this.hoverClassname
        )
      };
    }
  },
  methods: {
    onDrag(dragEvent) {
      this.$emit("drag", dragEvent);
    },
    onEnter() {
      this.hover = true;
    },
    onLeave() {
      this.hover = false;
    }
  }
};
</script>

<template>
	<LineWrapper @enter="onEnter" @leave="onLeave" @drag="onDrag" :position="position">
		<div :class="classnames.default" ></div>
	</LineWrapper>
</template>

<style lang="scss">
.vue-default-line {
  background: none;
  transition: border 0.5s;
  border-color: transparent;
  border-width: 0px;
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