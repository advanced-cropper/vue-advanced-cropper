<script>
import debounce from 'debounce';
import { ManipulateImageEvent } from '../../core/events.ts';
import { calculateGeometricProperties } from '../../core/touch';
import { sign } from '../../core/utils';

export default {
	props: {
		touchMove: {
			type: Boolean,
			required: true,
		},
		mouseMove: {
			type: Boolean,
			required: true,
		},
		touchResize: {
			type: Boolean,
			required: true,
		},
		wheelResize: {
			type: [Boolean, Object],
			required: true,
		},
		eventsFilter: {
			type: Function,
			required: false,
		},
	},
	beforeMount() {
		window.addEventListener('mouseup', this.onMouseUp, { passive: false });
		window.addEventListener('mousemove', this.onMouseMove, { passive: false });
		window.addEventListener('touchmove', this.onTouchMove, { passive: false });
		window.addEventListener('touchend', this.onTouchEnd, { passive: false });
	},
	beforeUnmount() {
		window.removeEventListener('mouseup', this.onMouseUp);
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('touchmove', this.onTouchMove);
		window.removeEventListener('touchend', this.onTouchEnd);
	},
	created() {
		this.transforming = false;
		this.debouncedProcessEnd = debounce(this.processEnd);
		this.touches = [];
	},
	methods: {
		processMove(event, newTouches) {
			if (this.touches.length) {
				if (this.touches.length === 1 && newTouches.length === 1) {
					this.$emit(
						'move',
						new ManipulateImageEvent({
							left: this.touches[0].clientX - newTouches[0].clientX,
							top: this.touches[0].clientY - newTouches[0].clientY,
						}),
					);
				} else if (this.touches.length > 1 && this.touchResize) {
					const newProperties = calculateGeometricProperties(newTouches, this.$refs.container);
					const oldProperties = this.oldGeometricProperties;

					if (oldProperties.count === newProperties.count && oldProperties.count > 1) {
						this.$emit(
							'resize',
							new ManipulateImageEvent(
								{
									left: oldProperties.centerMass.left - newProperties.centerMass.left,
									top: oldProperties.centerMass.top - newProperties.centerMass.top,
								},
								{
									factor: oldProperties.spread / newProperties.spread,
									center: newProperties.centerMass,
								},
							),
						);
					}
					this.oldGeometricProperties = newProperties;
				}
				this.touches = newTouches;
			}
		},
		processEnd() {
			if (this.transforming) {
				this.transforming = false;
				this.$emit('transform-end');
			}
		},
		processStart() {
			this.transforming = true;
			this.debouncedProcessEnd.clear();
		},
		processEvent(e) {
			if (this.eventsFilter) {
				return this.eventsFilter(e, this.transforming) !== false;
			} else {
				e.preventDefault();
				e.stopPropagation();
				return true;
			}
		},
		onTouchStart(e) {
			if (e.cancelable && (this.touchMove || (this.touchResize && e.touches.length > 1))) {
				if (this.processEvent(e)) {
					const container = this.$refs.container;
					const { left, top, bottom, right } = container.getBoundingClientRect();
					this.touches = [...e.touches].filter(
						(touch) =>
							touch.clientX > left &&
							touch.clientX < right &&
							touch.clientY > top &&
							touch.clientY < bottom,
					);
					this.oldGeometricProperties = calculateGeometricProperties(this.touches, container);
				}
			}
		},
		onTouchEnd(e) {
			if (e.touches.length === 0) {
				this.touches = [];
				this.processEnd();
			}
		},
		onTouchMove(e) {
			if (this.touches.length) {
				const touches = [...e.touches].filter(
					(touch) =>
						!touch.identifier ||
						this.touches.find((anotherTouch) => anotherTouch.identifier === touch.identifier),
				);
				if (this.processEvent(e)) {
					this.processMove(e, touches);
					this.processStart();
				}
			}
		},
		onMouseDown(e) {
			if (this.mouseMove && 'buttons' in e && e.buttons === 1) {
				if (this.processEvent(e)) {
					const touch = {
						fake: true,
						clientX: e.clientX,
						clientY: e.clientY,
					};
					this.touches = [touch];
					this.processStart();
				}
			}
		},
		onMouseMove(e) {
			if (this.touches.length) {
				if (this.processEvent(e)) {
					this.processMove(e, [
						{
							clientX: e.clientX,
							clientY: e.clientY,
						},
					]);
				}
			}
		},
		onMouseUp() {
			this.touches = [];
			this.processEnd();
		},
		onWheel(event) {
			if (this.wheelResize) {
				if (this.processEvent(event)) {
					const container = this.$refs.container;
					const { left, top } = container.getBoundingClientRect();
					const factor = 1 + this.wheelResize.ratio * sign(event.deltaY || event.detail || event.wheelDelta);
					const center = {
						left: event.clientX - left,
						top: event.clientY - top,
					};

					this.$emit('resize', new ManipulateImageEvent({}, { factor, center }));

					if (!this.touches.length) {
						this.debouncedProcessEnd();
					}
				}
			}
		},
	},
	emits: ['resize', 'move', 'transform-end'],
};
</script>

<template>
	<div ref="container" @touchstart="onTouchStart" @mousedown="onMouseDown" @wheel="onWheel">
		<slot />
	</div>
</template>
