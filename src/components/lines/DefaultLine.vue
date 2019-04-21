<script>
import classnames from "classnames";
import bem from "easy-bem";
import handler from "../../mixins/handler.js";

const cn = bem("vue-default-line");

export default {
  name: "SquareHandler",
  mixins: [handler],
  props: {
    classname: {
      type: String
    },
    position: {
      type: String
    },
  },
  computed: {
    classnames() {
      return {
        default: classnames(!this.disableDefaultClasses && cn({[this.position]: true}), this.classname)
      };
    }
  }
};
</script>

<template>
  <div 
    ref="handler" 
    :class="classnames.default" 
    @touchstart="this.onTouchStart"
    @mousedown="this.onMouseDown"
  >
  </div>
</template>

<style lang="scss">
.vue-default-line {
	background: none;
	&:after {
		content: "";
		transition: border 0.5s;
		border: dashed 1px transparent;
		position: absolute;
	}
	&--north, &--south {
		height: 12px;
		&:after {
			height: 0px;
			width: 100%;
			top: 50%;
			left: 0;
		}
		&, &:after {
			transform: translateY(-50%);
		}
	}
	&--east, &--west {
		width: 12px;
		&:after {
			width: 0px;
			height: 100%;
			left: 50%;
		}
		&, &:after {
			transform: translateX(-50%);
		}
	}
	&--east:hover:after {
		border-right: dashed 1px rgba(white, 0.3);
	}
	&--west:hover:after {
		border-left: dashed 1px rgba(white, 0.3);
	}
	&--south:hover:after {
		border-top: dashed 1px rgba(white, 0.3);
	}
	&--north:hover:after {
		border-bottom: dashed 1px rgba(white, 0.3);
	}
}
</style>