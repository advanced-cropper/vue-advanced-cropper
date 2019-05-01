<script>
import classnames from 'classnames';
import bem from 'easy-bem';

import { SquareHandler } from '../handlers'
import { DefaultLine } from '../lines'

const cn = bem('vue-bounding-box')

const HORIZONTAL_DIRECTIONS = ['east', 'west', null]
const VERTICAL_DIRECTIONS = ['south', 'north', null]

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
  data() {
    const points = []
    HORIZONTAL_DIRECTIONS.forEach(hDirection => {
      VERTICAL_DIRECTIONS.forEach(vDirection => {
        let name, className;
        if (hDirection !== vDirection) {
          if (hDirection && vDirection) {
            name = `${hDirection}${vDirection[0].toUpperCase()}${vDirection.slice(1)}`
            className = `${hDirection}-${vDirection}`
          } else  {
            name = hDirection || vDirection
            className = hDirection || vDirection
          }
          points.push({
            name,
            className,
            verticalDirection: vDirection,
            horizontalDirection: hDirection
          })
        }
      })
    })
    return {
      points
    }
  },
  computed: {
    classnames() {
      const handler = {}
      const line = {}

      this.points.forEach(point => {
        if (!point.horizontalDirection || !point.verticalDirection) {
          line[point.name] = classnames(!this.disableDefaultClasses && cn('line', {[point.className]: true}), this.lineClassnames[point.name])
        }
        handler[point.name] = classnames(!this.disableDefaultClasses && cn('handler', {[point.className]: true}), this.handlerClassnames[point.name])
      })

      return {
        default: classnames(!this.disableDefaultClasses && cn(), this.classname),
        handler,
        line,
      }
    },
    lineNodes() {
      const lines = []
      this.points.forEach(point => {
        if (!point.horizontalDirection || !point.verticalDirection) {
          lines.push({
            name: point.name,
            component: this.lineComponent,
            visible: !!this.lines[point.name],
            className: this.classnames.line[point.name],
            verticalDirection: point.verticalDirection,
            horizontalDirection: point.horizontalDirection
          })
        }
      })
      return lines
    },
    handlerNodes() {
      const handlers = []
      this.points.forEach(point => {
        handlers.push({
          name: point.name,
          component: this.handlerComponent,
          visible: !!this.handlers[point.name],
          className: this.classnames.handler[point.name],
          verticalDirection: point.verticalDirection,
          horizontalDirection: point.horizontalDirection
        })
      })
      return handlers
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
    onHandlerMove(dragEvent, horizontalDirection, verticalDirection) {
      const position = dragEvent.position
      const anchor = dragEvent.anchor
      const directions = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
      const handler = dragEvent.element
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
        nativeEvent: dragEvent.nativeEvent,
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
        v-for="line in lineNodes"
        v-if="line.visible" 
        :key="line.name"
        :is="line.component"
        :classname="line.className"
        :position="line.name" 
        @move="onHandlerMove($event, line.horizontalDirection, line.verticalDirection)"
      />
    </div>
    <div>
      <component 
        v-for="handler in handlerNodes"
        v-if="handler.visible" 
        :key="handler.name"
        :is="handler.component"
        :classname="handler.className"
        :horizontalPosition="handler.horizontalDirection" 
        :verticalPosition="handler.verticalDirection" 
        @move="onHandlerMove($event, handler.horizontalDirection, handler.verticalDirection)"
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