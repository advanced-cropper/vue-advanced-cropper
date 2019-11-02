<script>
import { ManipulateImageEvent } from '../../core/events.js';
import { distance } from '../../core/utils.js';

export default {
	name: 'CropperWrapper',
	props: {
		touchMove: {
			type: Boolean,
		},
		mouseMove: {
			type: Boolean,
		},
		touchResize: {
			type: Boolean,
		},
		wheelResize: {
			type: Boolean,
		},
		wheelZoomRatio: {
			type: Number,
			default: 0.1,
		},
	},
	beforeMount() {
		window.addEventListener('mouseup', this.onMouseUp, { passive: false, });
		window.addEventListener('mousemove', this.onMouseMove, { passive: false, });
		window.addEventListener('touchmove', this.onTouchMove, { passive: false, });
		window.addEventListener('touchend', this.onTouchEnd, { passive: false, });
	},
	beforeDestroy() {
		window.removeEventListener('mouseup', this.onMouseUp);
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('touchmove', this.onTouchMove);
		window.removeEventListener('touchend', this.onTouchEnd);
	},
	mounted() {
		this.touches = [];
		this.draggingAnchor = [];
	},
	methods: {
		onTouchStart(e) {
			if (e.cancelable && (this.touchMove || (this.touchResize && e.touches.length > 1))) {
				const container = this.$refs.container;
				const { left, top, bottom, right } = container.getBoundingClientRect();
				this.touches = [...e.touches].filter(touch => (
					touch.clientX > left && touch.clientX < right && touch.clientY > top && touch.clientY < bottom
				));
				this.oldGeometricProperties = this.calculateGeometricProperties(this.touches);

				if (e.preventDefault) {
					e.preventDefault();
				}
				e.stopPropagation();
			}
		},
		onTouchEnd(e) {
			if (e.touches.length === 0) {
				this.processEnd();
			}
		},
		onTouchMove(e) {
			if (this.touches.length) {
				const touches = [...e.touches].filter(touch => !touch.identifier || this.touches.find(
					anotherTouch => anotherTouch.identifier === touch.identifier
				));
				this.processMove(e, touches);
				if (e.preventDefault) {
					e.preventDefault();
				}
				if (e.stopPropagation) {
					e.stopPropagation();
				}
			}
		},
		onMouseDown(e) {
			if (this.mouseMove && ('buttons' in e) && e.buttons === 1) {
				const touch = {
					fake: true,
					clientX: e.clientX,
					clientY: e.clientY,
				};
				this.touches = [touch];
				this.initAnchor(touch);
				e.stopPropagation();
			}
		},
		onMouseMove(e) {
			if (this.touches.length) {
				this.processMove(e, [{
					fake: true,
					clientX: e.clientX,
					clientY: e.clientY,
				}]);
				if (e.preventDefault  && e.cancelable) {
					e.preventDefault();
				}
			}
		},
		onMouseUp() {
			this.touches = [];
		},
		initAnchor(touch) {
			const container = this.$refs.container;
			const { left, top, } = container.getBoundingClientRect();

			this.anchor = {
				x: touch.clientX - left,
				y: touch.clientY - top,
			};
		},
		calculateGeometricProperties(touches) {
			const container = this.$refs.container;
			const { left, top } = container.getBoundingClientRect();

			const centerMass = { left: 0,top: 0 };
			let spread = 0;

			touches.forEach(touch => {
				centerMass.left += (touch.clientX - left) / touches.length;
				centerMass.top += (touch.clientY - top) / touches.length;
			});

			touches.forEach((touch) => {
				spread += distance({ x: centerMass.left, y: centerMass.top }, { x: touch.clientX - left, y: touch.clientY - top });
			});

			return { centerMass, spread, count: touches.length };
		},
		processMove(event, newTouches) {
			if (this.touches.length) {
				if (this.touches.length === 1 && newTouches.length === 1 && this.touchMove) {
					this.$emit('move', new ManipulateImageEvent(event, {
						left: (newTouches[0].clientX - this.touches[0].clientX),
						top: (newTouches[0].clientY - this.touches[0].clientY),
					}));
				} else if (this.touches.length > 1 && this.touchResize) {
					const oldProperties = this.oldGeometricProperties;
					const newProperties = this.calculateGeometricProperties(newTouches);

					if (oldProperties.count === newProperties.count && oldProperties.count > 1) {
						this.$emit('resize', new ManipulateImageEvent(
							event,
							{
								left: newProperties.centerMass.left - oldProperties.centerMass.left,
								top: newProperties.centerMass.top - oldProperties.centerMass.top,
							},
							{
								factor: oldProperties.spread / newProperties.spread,
								center: newProperties.centerMass,
							}
						));
					}
					this.oldGeometricProperties = newProperties;
				}
				this.touches = newTouches;
			}
		},
		processEnd() {
			this.touches = [];
		},
		onWheel(event) {
			if (this.wheelResize) {
				const container = this.$refs.container;
				const { left, top } = container.getBoundingClientRect();
				const factor = 1 + this.wheelZoomRatio * Math.sign(event.deltaY || event.detail || event.wheelDelta);
				const center = {
					left: (event.clientX - left),
					top: (event.clientY - top),
				};

				this.$emit('resize', new ManipulateImageEvent(event, {}, { factor, center }));

				event.preventDefault();
				event.stopPropagation();
			}
		}
	},

};
</script>

<template>
  <div
    ref="container"
    @touchstart="onTouchStart"
    @mousedown="onMouseDown"
    @wheel="onWheel"
  >
    <slot />
  </div>
</template>
