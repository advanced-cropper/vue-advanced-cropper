import { DragEvent } from '../core/events';

export default {
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
		if (!this.$refs.draggable) {
			throw new Error('You should add ref "draggable" to your root element to use draggable mixin');
		}
		this.touches = [];
		this.hovered = false;
	},
	methods: {
		onMouseOver() {
			if (!this.hovered) {
				this.hovered = true;
				this.$emit('enter');
			}
		},
		onMouseLeave() {
			if (this.hovered && !this.touches.length) {
				this.hovered = false;
				this.$emit('leave');
			}
		},
		onTouchStart(e) {
			if (e.cancelable && !this.disabled && e.touches.length === 1) {
				this.touches = [...e.touches];

				if (!this.hovered) {
					this.$emit('enter');
					this.hovered = true;
				}

				if (e.touches.length) {
					this.initAnchor(
						this.touches.reduce(
							(mean, touch) => {
								return {
									clientX: mean.clientX + touch.clientX / e.touches.length,
									clientY: mean.clientY + touch.clientY / e.touches.length,
								};
							},
							{ clientX: 0, clientY: 0 },
						),
					);
				}
				if (e.preventDefault) {
					e.preventDefault();
				}
				e.stopPropagation();
			}
		},
		onTouchEnd() {
			this.processEnd();
		},
		onTouchMove(e) {
			if (this.touches.length) {
				this.processMove(e, e.touches);
				if (e.preventDefault) {
					e.preventDefault();
				}
				if (e.stopPropagation) {
					e.stopPropagation();
				}
			}
		},
		onMouseDown(e) {
			if (!this.disabled && e.button === 0) {
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
				if (e.preventDefault) {
					e.preventDefault();
				}
			}
		},
		onMouseUp() {
			this.processEnd();
		},
		initAnchor(touch) {
			const draggable = this.$refs.draggable;
			const { left, right, bottom, top } = draggable.getBoundingClientRect();

			this.anchor = {
				left: touch.clientX - left,
				top: touch.clientY - top,
				bottom: bottom - touch.clientY,
				right: right - touch.clientX,
			};
		},
		processMove(event, touches) {
			const newTouches = [...touches];
			if (this.touches.length) {
				if (this.touches.length === 1 && newTouches.length === 1) {
					const element = this.$refs.draggable;
					this.$emit(
						'drag',
						new DragEvent(
							event,
							element,
							{
								left: newTouches[0].clientX,
								top: newTouches[0].clientY,
							},
							{
								left: this.touches[0].clientX,
								top: this.touches[0].clientY,
							},
							this.anchor,
						),
					);
				}
				this.touches = newTouches;
			}
		},
		processEnd() {
			if (this.touches.length) {
				this.$emit('drag-end');
			}
			if (this.hovered) {
				this.$emit('leave');
				this.hovered = false;
			}
			this.touches = [];
		},
	},
};
