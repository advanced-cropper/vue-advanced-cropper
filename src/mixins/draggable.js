import { DragEvent } from '../utils/events'

export default {
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
    if (!this.$refs.draggable) {
      throw new Error(
        'You should add ref "draggable" to your root element to use draggable mixin'
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
      const draggable = this.$refs.draggable
      const {left, right, bottom, top} = draggable.getBoundingClientRect()

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
          const element = this.$refs.draggable

          this.$emit('move', new DragEvent(event, {
            left: newTouches[0].clientX,
            top: newTouches[0].clientY
          },
          element,
          this.anchor
          ))
        }
        this.touches = newTouches
      }
    },
    processEnd() {
      this.touches = []
    }
  }
}
