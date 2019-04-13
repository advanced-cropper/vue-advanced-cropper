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
    if (!this.$refs.stencil) {
      throw new Error('You should add ref "stencil" to your root stencil component to use dragStencil mixin')
    }
    this.touches = []
    this.draggingAnchor = []
  },
  methods: {
    onTouchStart(e) {
      this.touches = [...e.touches]

      if (e.touches.length) {
        this.initAnchor(this.touches.reduce((mean, touch) => {
          return {
            clientX: mean.clientX + touch.clientX / e.touches.length,
            clientY: mean.clientY + touch.clientY / e.touches.length
          }
        }, {clientX: 0, clientY: 0}))
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onTouchEnd(e) {
      this.processEnd()
    },
    onTouchMove(e) {
      if (this.touches.length) {
        this.processMove(e.touches)
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
        this.processMove([{
          fake: true,
          clientX: e.clientX,
          clientY: e.clientY
        }])
        if (e.preventDefault) {
          e.preventDefault()
        }
      }
    },
    onMouseUp(e) {
      this.touches = []
    },
    initAnchor(touch) {
      const stencil = this.$refs.stencil
      const {left, top} = stencil.getBoundingClientRect()

      this.anchor = {
        x: touch.clientX - left,
        y: touch.clientY - top
      }
    },
    onMove(move) {
      const coefficient = this.width / this.stencilWidth
      this.$emit('change', {
        left: this.left + coefficient * move.x,
        top: this.top + coefficient * move.y,
        width: this.width,
        height: this.height
      })
    },
    processMove(touches) {
      const newTouches = [...touches]
      if (this.touches.length) {
        const coefficient = this.width / this.stencilWidth

        const stencil = this.$refs.stencil

        const {left, top} = stencil.getBoundingClientRect()

        // Moving:
        const coordinates = {
          width: this.width,
          height: this.height,
          left: this.left,
          top: this.top
        }

        if (this.touches.length === 1 && newTouches.length === 1) {
          this.onMove({
            x: (newTouches[0].clientX - left - this.anchor.x),
            y: (newTouches[0].clientY - top - this.anchor.y)
          })
        } else if (this.touches.length > 1 && this.touches.length === newTouches.length) {
          const vectors = newTouches.map((touch, index) => ({
            x: touch.clientX - this.touches[index].clientX,
            y: touch.clientY - this.touches[index].clientY,
            position: {
              clientX: touch.clientX,
              clientY: touch.clientY
            },
            length: Math.sqrt(
              Math.pow(touch.clientX - this.touches[index].clientX, 2) +
              Math.pow(touch.clientY - this.touches[index].clientY, 2)
            )
          }))

          const summaryShift = vectors.reduce((shift, vector) => shift + vector.length, 0)

          const massPoint = {
            x: vectors.reduce((value, vector, index) => value + (1 - vector.length / summaryShift) * newTouches[index].clientX, 0),
            y: vectors.reduce((value, vector, index) => value + (1 - vector.length / summaryShift) * newTouches[index].clientY, 0)
          }

          let resize = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }

          vectors.forEach((vector, index) => {
            if (vector.length / summaryShift > 0.25) {
              if (newTouches[index].clientY > massPoint.y) {
                resize.top += vector.y
              } else {
                resize.bottom -= vector.y
              }
              if (newTouches[index].clientX > massPoint.x) {
                resize.right += vector.x
              } else {
                resize.left -= vector.x
              }
            }
          })

          coordinates.height += (resize.top + resize.bottom) * coefficient
          coordinates.top -= resize.bottom * coefficient

          coordinates.width += (resize.left + resize.right) * coefficient
          coordinates.left -= resize.left * coefficient
        }
        this.touches = newTouches
      }
    },
    processEnd() {
      this.touches = []
    }
  }
}
