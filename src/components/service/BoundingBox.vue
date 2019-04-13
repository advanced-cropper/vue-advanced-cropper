<script>
import classnames from 'classnames';
import bem from 'easy-bem';

import CircleHandler from '../handlers/SquareHandler.vue'

const cn = bem('vue-bounding-box')

export default {
  name: "PreviewImage",
  props: {
    img: {
      type: String
    },
    classname: {
      type: String,
    },
    imageClassname: {
      type: String,
		},
		handlerComponent: {
      type: [Object, String],
      default() {
        return CircleHandler
      },
    },
    handlerClassnames: {
      type: Object,
      default() {
        return {}
      },
    },
		lineComponent: {
      type: [Object, String],
      default() {
        return 'RectangleStencil'
      },
    },
  },
  computed: {
    classnames() {
      const handler = {};

      return {
        default: classnames(!this.disableDefaultClasses && cn(), this.classname),
        handler: {
          eastNorth: classnames(!this.disableDefaultClasses && cn('handler', {'east-north': true}), this.handlerClassnames.eastNorth),
          north: classnames(!this.disableDefaultClasses && cn('handler', {'north': true}), this.handlerClassnames.north),
          westNorth: classnames(!this.disableDefaultClasses && cn('handler', {'west-north': true}), this.handlerClassnames.westNorth),
          west: classnames(!this.disableDefaultClasses && cn('handler', {'west': true}), this.handlerClassnames.west),
          westSouth: classnames(!this.disableDefaultClasses && cn('handler', {'west-south': true}), this.handlerClassnames.westSouth),
          south: classnames(!this.disableDefaultClasses && cn('handler', {'south': true}), this.handlerClassnames.south),
          eastSouth: classnames(!this.disableDefaultClasses && cn('handler', {'east-south': true}), this.handlerClassnames.eastSouth),
          east: classnames(!this.disableDefaultClasses && cn('handler', {'east': true}), this.handlerClassnames.east),
        }
      }
    },
  },
  methods: {
    onHandlerMove(coordinates, horizontalDirection, verticalDirection) {
      const resizeDirections = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
      if (horizontalDirection === 'west') {
        resizeDirections.left += coordinates.x
      }
      else if (horizontalDirection === 'east') {
        resizeDirections.right -= coordinates.x
      }
      if (verticalDirection === 'north') {
        resizeDirections.top += coordinates.y
      }
      else if (verticalDirection === 'south') {
        resizeDirections.bottom -= coordinates.y
      }
      this.$emit('change', resizeDirections)
    }
  }
};
</script>

<template>
  <div :class="classnames.default">
    <slot></slot>
    <div>
      <component @move="onHandlerMove($event, 'east', 'north')" :is="handlerComponent" :class="classnames.handler.eastNorth"/>
      <component @move="onHandlerMove($event,  null,  'north')" :is="handlerComponent" :class="classnames.handler.north"/>
      <component @move="onHandlerMove($event, 'west', 'north')" :is="handlerComponent" :class="classnames.handler.westNorth"/>
      <component @move="onHandlerMove($event, 'west',  null)" :is="handlerComponent" :class="classnames.handler.west"/>
      <component @move="onHandlerMove($event, 'west', 'south')" :is="handlerComponent" :class="classnames.handler.westSouth"/>
      <component @move="onHandlerMove($event,  null,  'south')" :is="handlerComponent" :class="classnames.handler.south"/>
      <component @move="onHandlerMove($event, 'east', 'south')" :is="handlerComponent" :class="classnames.handler.eastSouth"/>
      <component @move="onHandlerMove($event, 'east',  null)" :is="handlerComponent" :class="classnames.handler.east" />
    </div>
  </div>
</template>

<style lang="scss">
  .vue-bounding-box {
		position: relative;
    &__handler {
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
  }
</style>