<script>
import classnames from 'classnames';
import bem from 'easy-bem';

import { SquareHandler } from '../handlers'
import { DefaultLine } from '../lines'

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
    handlers: {
      type: Object,
      default() {
        return {
          eastNorth: true,
          north: true,
          westNorth: true,
          west: true,
          westSouth: true,
          south: true,
          eastSouth: true,
          east: true,
        }
      }
    },
		handlerComponent: {
      type: [Object, String],
      default() {
        return SquareHandler
      },
    },
    handlerClassnames: {
      type: Object,
      default() {
        return {}
      },
    },
    lines: {
      type: Object,
      default() {
        return {
          west: true,
          north: true,
          east: true,
          south: true,
        }
      }
    },
		lineComponent: {
      type: [Object, String],
      default() {
        return DefaultLine
      },
    },
    lineClassnames: {
      type: Object,
      default() {
        return {}
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
        },
        line: {
          north: classnames(!this.disableDefaultClasses && cn('line', {'north': true}), this.lineClassnames.north),
          west: classnames(!this.disableDefaultClasses && cn('line', {'west': true}), this.lineClassnames.west),
          south: classnames(!this.disableDefaultClasses && cn('line', {'south': true}), this.lineClassnames.south),
          east: classnames(!this.disableDefaultClasses && cn('line', {'east': true}), this.lineClassnames.east),
        },
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
    onHandlerMove(handlerEvent, horizontalDirection, verticalDirection) {
      const position = handlerEvent.position
      const anchor = handlerEvent.anchor
      const directions = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
      const handler = handlerEvent.handler
      const {left, right, bottom, top} = handler.getBoundingClientRect()

      if (horizontalDirection === 'west') {
        directions.left += left - position.left + anchor.left
      }
      else if (horizontalDirection === 'east') {
        directions.right += position.left - right + anchor.right
      }
      if (verticalDirection === 'north') {
        directions.top += top - position.top + anchor.top
      }
      else if (verticalDirection === 'south') {
        directions.bottom += position.top - bottom + anchor.bottom
      }
      
      let respectDirection
      if (!verticalDirection && horizontalDirection) {
        respectDirection = 'width'
      } else if (verticalDirection && !horizontalDirection) {
        respectDirection = 'height'
      }

      this.$emit('resize', {
        nativeEvent: handlerEvent.nativeEvent,
        directions,
        allowedDirections: {
          left: horizontalDirection === 'west'  || !horizontalDirection,
          right: horizontalDirection === 'east' || !horizontalDirection,
          bottom: verticalDirection === 'south' || !verticalDirection,
          top: verticalDirection === 'north' || !verticalDirection,
        },
        respectDirection
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
      <component 
        :is="lineComponent"
        v-if="lines.north" 
        :classname="classnames.line.north"
        position="north" 
        @move="onHandlerMove($event,  null,  'north')"
      />
      <component
        :is="lineComponent" 
        v-if="lines.west" 
        :classname="classnames.line.west"
        position="west"  
        @move="onHandlerMove($event, 'west',  null)"  
      />
      <component 
        :is="lineComponent"
        v-if="lines.south"
        :classname="classnames.line.south"
        position="south"  
        @move="onHandlerMove($event, null, 'south')"  
      />
      <component 
        :is="lineComponent"
        v-if="lines.east"
        :classname="classnames.line.east"
        position="east"  
        @move="onHandlerMove($event, 'east',  null)"  
      />
    </div>
    <div>
      <component 
        :is="handlerComponent"
        vertical-position="north" 
        horizontal-position="east" 
        v-if="handlers.eastNorth" 
        @move="onHandlerMove($event, 'east', 'north')"  
        :classname="classnames.handler.eastNorth"
      />
      <component 
        :is="handlerComponent"
        vertical-position="north" 
        v-if="handlers.north" 
        @move="onHandlerMove($event,  null,  'north')"  
        :classname="classnames.handler.north"
      />
      <component 
        :is="handlerComponent"
        vertical-position="north"
        horizontal-position="west" 
        v-if="handlers.westNorth" 
        @move="onHandlerMove($event, 'west', 'north')"  
        :classname="classnames.handler.westNorth"
      />
      <component 
        :is="handlerComponent"
        horizontal-position="west" 
        v-if="handlers.west" 
        @move="onHandlerMove($event, 'west',  null)"  
        :classname="classnames.handler.west"
      />
      <component 
        :is="handlerComponent"
        vertical-position="south" 
        horizontal-position="west" v-if="handlers.westSouth" 
        @move="onHandlerMove($event, 'west', 'south')"  
        :classname="classnames.handler.westSouth"
      />
      <component 
        :is="handlerComponent"
        vertical-position="south" 
        v-if="handlers.south" 
        @move="onHandlerMove($event,  null,  'south')"  
        :classname="classnames.handler.south"
      />
      <component 
        :is="handlerComponent"
        vertical-position="south" 
        horizontal-position="east" 
        v-if="handlers.eastSouth"
        @move="onHandlerMove($event, 'east', 'south')"  
        :classname="classnames.handler.eastSouth"
      />
      <component 
        :is="handlerComponent"
        horizontal-position="east" 
        v-if="handlers.east" 
        @move="onHandlerMove($event, 'east',  null)"  
        :classname="classnames.handler.east"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .vue-bounding-box {
		position: relative;
    &__line {
      position: absolute;
      &--north {
        top: 0;
        width: 100%;
        cursor: n-resize;
      }
      &--east {
        left: 100%;
        top: 0;
        height: 100%;
        cursor: e-resize;
      }
      &--south {
        top: 100%;
        width: 100%;
        cursor: s-resize;
      }
      &--west {
        left: 0;
        top: 0;
        height: 100%;
        cursor: w-resize;
      }
    }
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