<script>
import classnames from 'classnames';
import bem from 'easy-bem';

import CircleHandler from '../handlers/SquareHandler.vue'

const cn = bem('vue-bounding-box')

export default {
  name: "BoundingBox",
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
  created() {
    window.addEventListener('mouseup', this.onMouseUp, { passive: false })
    window.addEventListener('mousemove', this.onMouseMove, { passive: false })
    window.addEventListener('touchmove', this.onTouchMove, { passive: false })
    window.addEventListener('touchend', this.onTouchEnd, { passive: false })
  },
  destroyed() {
    window.removeEventListener('mouseup', this.onMouseUp)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('touchmove', this.onTouchMove)
    window.removeEventListener('touchend', this.onTouchEnd)
  },
  mounted() {
    this.touches = []
    this.draggingAnchor = []
  },
  methods: {
    onHandlerMove(moveEvent, horizontalDirection, verticalDirection) {
      const position = moveEvent.position
      const anchor = moveEvent.anchor
      const scaling = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
      const handler = moveEvent.handler
      const {left, right, bottom, top} = handler.getBoundingClientRect()

      if (horizontalDirection === 'west') {
        scaling.left += left - position.left + anchor.left
      }
      else if (horizontalDirection === 'east') {
        scaling.right += position.left - right + anchor.right
      }
      if (verticalDirection === 'north') {
        scaling.top += top - position.top + anchor.top
      }
      else if (verticalDirection === 'south') {
        scaling.bottom += position.top - bottom + anchor.bottom
      }
      // if (horizontalDirection === 'west') {
      //   scaling.left += left - position.left + (right - left)/2
      // }
      // else if (horizontalDirection === 'east') {
      //   scaling.right += position.left - right + (right - left)/2
      // }
      // if (verticalDirection === 'north') {
      //   scaling.top += top - position.top + (bottom - top)/2
      // }
      // else if (verticalDirection === 'south') {
      //   scaling.bottom += position.top - bottom + (bottom - top)/2
      // }
      
      this.$emit('resize', {
        nativeEvent: moveEvent.nativeEvent,
        scaling,
        horizontalDirection,
        verticalDirection
      })
    },
  }
};
</script>

<template>
  <div 
    ref="box"
    :class="classnames.default"
  >
    <slot></slot>
    <div>
      <component @move="onHandlerMove($event, 'east', 'north')" :is="handlerComponent" :class="classnames.handler.eastNorth" horizontal vertical/>
      <component @move="onHandlerMove($event,  null,  'north')" :is="handlerComponent" :class="classnames.handler.north" vertical/>
      <component @move="onHandlerMove($event, 'west', 'north')" :is="handlerComponent" :class="classnames.handler.westNorth" horizontal vertical/>
      <component @move="onHandlerMove($event, 'west',  null)" :is="handlerComponent" :class="classnames.handler.west" horizontal/>
      <component @move="onHandlerMove($event, 'west', 'south')" :is="handlerComponent" :class="classnames.handler.westSouth" horizontal vertical/>
      <component @move="onHandlerMove($event,  null,  'south')" :is="handlerComponent" :class="classnames.handler.south" vertical/>
      <component @move="onHandlerMove($event, 'east', 'south')" :is="handlerComponent" :class="classnames.handler.eastSouth" horizontal vertical/>
      <component @move="onHandlerMove($event, 'east',  null)" :is="handlerComponent" :class="classnames.handler.east"  horizontal/>
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