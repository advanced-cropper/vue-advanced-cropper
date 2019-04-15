import { MoveEvent } from '../utils/events'

export default {
  props: {
    horizontal: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: false
    }
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
    if (!this.$refs.handler) {
      throw new Error(
        'You should add ref "handler" to your root handler component to use dragHandler mixin'
      )
    }
    this.touches = []
    this.draggingAnchor = []
  },
  methods: {
    onTouchStart(e) {
      this.touches = [...e.touches]

      if (e.touches.length) {
        this.initAnchor(
          this.touches.reduce(
            (mean, touch) => {
              return {
                clientX: mean.clientX + touch.clientX / e.touches.length,
                clientY: mean.clientY + touch.clientY / e.touches.length
              }
            },
            { clientX: 0, clientY: 0 }
          )
        )
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onTouchEnd(e) {
      this.processEnd()
    },
    onTouchMove(e) {
      if (this.touches.length) {
        this.processMove(e, e.touches)
        if (e.preventDefault) {
          e.preventDefault()
        }
        if (e.stopPropagation) {
          e.stopPropagation()
        }
      }
    },
    onMouseDown(e) {
      const touch = {
        fake: true,
        clientX: e.clientX,
        clientY: e.clientY
      }
      this.touches = [touch]
      this.initAnchor(touch)
      e.stopPropagation()
    },
    onMouseMove(e) {
      if (this.touches.length) {
        this.processMove(e, [
          {
            fake: true,
            clientX: e.clientX,
            clientY: e.clientY
          }
        ])
        if (e.preventDefault) {
          e.preventDefault()
        }
      }
    },
    onMouseUp(e) {
      this.touches = []
    },
    initAnchor(touch) {
      const handler = this.$refs.handler
      const {left, right, bottom, top} = handler.getBoundingClientRect()

      this.anchor = {
        left: touch.clientX - left,
        top: touch.clientY - top,
        bottom: bottom - touch.clientY,
        right: right - touch.clientX
      }
    },
    processMove(event, touches) {
      const newTouches = [...touches]
      if (this.touches.length) {
        if (this.touches.length === 1 && newTouches.length === 1) {
          const handler = this.$refs.handler
          const {left, right, bottom, top} = handler.getBoundingClientRect()

          // const horizontalMoveAllowed = Math.abs((left + right) / 2 - newTouches[0].clientX) < (right - left) / 2
          // const verticalMoveAllowed = Math.abs((top + bottom) / 2 - newTouches[0].clientY) < (bottom - top) / 2

          // if (this.horizontal && this.vertical && horizontalMoveAllowed && verticalMoveAllowed || this.horizontal && !this.vertical && horizontalMoveAllowed || !this.horizontal && this.vertical && verticalMoveAllowed) {
          this.$emit('move', {
            nativeEvent: event,
            handler: handler,
            anchor: this.anchor,
            position: {
              left: newTouches[0].clientX,
              top: newTouches[0].clientY
            }
          })
          // }
        }
        this.touches = newTouches
      }
    },
    processEnd() {
      this.touches = []
    }
  }
}
