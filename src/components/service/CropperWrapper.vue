<script>
import { ManipulateImageEvent } from 'advanced-cropper/events';
import { distance } from '../../core/utils.js';

export default {
	name: 'CropperWrapper',
	props: {
		touchMove: {
			type: Object,
			required: true
		},
		mouseMove: {
			type: Object,
			required: true
		},
		touchResize: {
			type: Object,
			required: true
		},
		wheelResize: {
			type: Object,
			required: true
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
	},
	methods: {
		onTouchStart(e) {
			if (e.cancelable && (this.touchMove.enabled || (this.touchResize.enabled && e.touches.length > 1))) {
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
		calculateGeometricProperties(touches) {
			const container = this.$refs.container;
			const { left, top } = container.getBoundingClientRect();

			const centerMass = { left: 0, top: 0 };
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
				if (this.touches.length === 1 && newTouches.length === 1 && this.touchMove.enabled) {
					this.$emit('move', new ManipulateImageEvent({
						left: (this.touches[0].clientX - newTouches[0].clientX),
						top: (this.touches[0].clientY - newTouches[0].clientY),
					}));
				} else if (this.touches.length > 1 && this.touchResize) {
					const oldProperties = this.oldGeometricProperties;
					const newProperties = this.calculateGeometricProperties(newTouches);

					if (oldProperties.count === newProperties.count && oldProperties.count > 1) {
						this.$emit('resize', new ManipulateImageEvent({
							left: oldProperties.centerMass.left - newProperties.centerMass.left,
							top: oldProperties.centerMass.top - newProperties.centerMass.top,
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
			if (this.wheelResize.enabled) {
				const container = this.$refs.container;
				const { left, top } = container.getBoundingClientRect();
				const factor = 1 + this.wheelResize.ratio * Math.sign(event.deltaY || event.detail || event.wheelDelta);
				const center = {
					left: (event.clientX - left),
					top: (event.clientY - top),
				};

				this.$emit('resize', new ManipulateImageEvent({}, { factor, center }));

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
