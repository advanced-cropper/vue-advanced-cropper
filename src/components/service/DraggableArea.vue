<script>
import classnames from 'classnames';
import bem from 'easy-bem';
import { distance } from '../../core/utils';
import { MoveEvent } from '../../core/events.ts';

const cn = bem('vue-draggable-area');

export default {
	name: 'DraggableArea',
	props: {
		movable: {
			type: Boolean,
			default: true,
		},
		activationDistance: {
			type: Number,
			default: 20,
		},
	},
	computed: {
		classnames() {
			return {
				default: cn(),
			};
		},
	},
	beforeMount() {
		window.addEventListener('mouseup', this.onMouseUp, { passive: false });
		window.addEventListener('mousemove', this.onMouseMove, { passive: false });
		window.addEventListener('touchmove', this.onTouchMove, { passive: false });
		window.addEventListener('touchend', this.onTouchEnd, { passive: false });
	},
	beforeDestroy() {
		window.removeEventListener('mouseup', this.onMouseUp);
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('touchmove', this.onTouchMove);
		window.removeEventListener('touchend', this.onTouchEnd);
	},
	mounted() {
		this.touches = [];
		this.touchStarted = false;
	},
	methods: {
		onTouchStart(e) {
			if (e.cancelable) {
				const shouldStartMove = this.movable && e.touches.length === 1;
				if (shouldStartMove) {
					this.touches = [...e.touches];
				}
				if (this.touchStarted || shouldStartMove) {
					e.preventDefault();
					e.stopPropagation();
				}
			}
		},
		onTouchEnd() {
			this.touchStarted = false;
			this.processEnd();
		},
		onTouchMove(e) {
			if (this.touches.length >= 1) {
				if (this.touchStarted) {
					this.processMove(e, e.touches);
					e.preventDefault();
					e.stopPropagation();
				} else if (
					distance(
						{ x: this.touches[0].clientX, y: this.touches[0].clientY },
						{ x: e.touches[0].clientX, y: e.touches[0].clientY },
					) > this.activationDistance
				) {
					this.initAnchor({
						clientX: e.touches[0].clientX,
						clientY: e.touches[0].clientY,
					});
					this.touchStarted = true;
				}
			}
		},
		onMouseDown(e) {
			if (this.movable && e.button === 0) {
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
				this.processMove(e, [
					{
						fake: true,
						clientX: e.clientX,
						clientY: e.clientY,
					},
				]);
				if (e.preventDefault && e.cancelable) {
					e.preventDefault();
				}
				e.stopPropagation();
			}
		},
		onMouseUp() {
			this.processEnd();
		},
		initAnchor(touch) {
			const container = this.$refs.container;
			const { left, top } = container.getBoundingClientRect();

			this.anchor = {
				x: touch.clientX - left,
				y: touch.clientY - top,
			};
		},
		processMove(event, touches) {
			const newTouches = [...touches];
			if (this.touches.length) {
				const container = this.$refs.container;
				const { left, top } = container.getBoundingClientRect();
				if (this.touches.length === 1 && newTouches.length === 1) {
					this.$emit(
						'move',
						new MoveEvent({
							left: newTouches[0].clientX - (left + this.anchor.x),
							top: newTouches[0].clientY - (top + this.anchor.y),
						}),
					);
				}
			}
		},
		processEnd() {
			if (this.touches.length) {
				this.$emit('move-end');
			}
			this.touches = [];
		},
	},
};
</script>

<template>
	<div ref="container" @touchstart="onTouchStart" @mousedown="onMouseDown">
		<slot />
	</div>
</template>

<style lang="scss">
.vue-draggable-area {
	position: relative;
}
</style>
