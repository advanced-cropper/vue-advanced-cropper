<script>
import classnames from 'classnames';
import bem from 'easy-bem';

import {ResizeEvent, MoveEvent} from '../../utils/events.js'

const cn = bem('vue-draggable-container')

export default {
	name: 'DraggableArea',
	computed: {
		classnames() {
			return {
				default: classnames(cn(), this.classname),
			}
		},
	},
	beforeMount() {
		window.addEventListener('mouseup', this.onMouseUp, { passive: false })
		window.addEventListener('mousemove', this.onMouseMove, { passive: false })
		window.addEventListener('touchmove', this.onTouchMove, { passive: false })
		window.addEventListener('touchend', this.onTouchEnd, { passive: false })
	},
	beforeDestroy() {
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
		onTouchStart(e) {
			if (e.cancelable) {
				this.touches = [...e.touches]

				if (e.touches.length) {
					this.initAnchor(this.touches.reduce((mean, touch) => {
						return {
							clientX: mean.clientX + touch.clientX / e.touches.length,
							clientY: mean.clientY + touch.clientY / e.touches.length
						}
					}, {clientX: 0, clientY: 0}))
				}
				if (e.preventDefault) {
					e.preventDefault()
				}
				e.stopPropagation()
			}
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
				this.processMove(e, [{
					fake: true,
					clientX: e.clientX,
					clientY: e.clientY
				}])
				if (e.preventDefault  && e.cancelable) {
					e.preventDefault()
				}
			}
		},
		onMouseUp(e) {
			this.touches = []
		},
		initAnchor(touch) {
			const container = this.$refs.container
			const {left, top} = container.getBoundingClientRect()

			this.anchor = {
				x: touch.clientX - left,
				y: touch.clientY - top
			}
		},
		processMove(event, touches) {
			const newTouches = [...touches]
			if (this.touches.length) {
				const container = this.$refs.container

				const {left, top} = container.getBoundingClientRect()

				const coordinates = {
					width: this.width,
					height: this.height,
					left: this.left,
					top: this.top
				}

				if (this.touches.length === 1 && newTouches.length === 1) {
					this.$emit('move', new MoveEvent(event, {
						left: (newTouches[0].clientX - left - this.anchor.x),
						top: (newTouches[0].clientY - top - this.anchor.y)
					}))
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
						left: vectors.reduce((value, vector, index) => value + (1 - vector.length / summaryShift) * newTouches[index].clientX, 0),
						top: vectors.reduce((value, vector, index) => value + (1 - vector.length / summaryShift) * newTouches[index].clientY, 0)
					}

					let directions = {
						top: 0,
						bottom: 0,
						left: 0,
						right: 0
					}

					vectors.forEach((vector, index) => {
						if (vector.length / summaryShift > 0.25) {
							if (newTouches[index].clientY > massPoint.top) {
								directions.bottom += vector.y
							} else {
								directions.top -= vector.y
							}
							if (newTouches[index].clientX > massPoint.left) {
								directions.right += vector.x
							} else {
								directions.left -= vector.x
							}
						}
					})
					this.$emit('resize', new ResizeEvent(event, directions))
				}
				this.touches = newTouches
			}
		},
		processEnd() {
			this.touches = []
		}
	}

};
</script>

<template>
  <div
    ref="container"
    @touchstart="onTouchStart"
    @mousedown="onMouseDown"
  >
    <slot />
  </div>
</template>

<style lang="scss">
  .vue-draggable-area {
	  position: relative;
  }
</style>
