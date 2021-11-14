<script>
import debounce from 'debounce';
import { TransformableImage } from 'vue-advanced-cropper';

export default {
	components: {
		TransformableImage,
	},
	props: ['touchMove', 'mouseMove', 'touchResize', 'wheelResize'],
	data() {
		return {
			notificationVisible: false,
			notificationType: null,
		};
	},
	created() {
		this.hideNotifications = debounce(() => {
			this.notificationVisible = false;
		}, 1000);
	},
	methods: {
		eventsFilter(nativeEvent, transforming) {
			if (nativeEvent.type === 'touchstart' || nativeEvent.type === 'touchmove') {
				if (nativeEvent.touches.length === 1 && !transforming) {
					this.notificationVisible = true;
					this.notificationType = 'touch';
					this.hideNotifications();
					return false;
				} else {
					this.notificationVisible = false;
				}
			} else if (nativeEvent.type === 'wheel') {
				if (!transforming && !nativeEvent.ctrlKey) {
					this.notificationVisible = true;
					this.notificationType = 'wheel';
					this.hideNotifications();
					return false;
				} else {
					this.notificationVisible = false;
				}
			}
			nativeEvent.preventDefault();
			nativeEvent.stopPropagation();
		},
	},
};
</script>

<template>
	<transformable-image
		:touch-move="touchMove"
		:touch-resize="touchResize"
		:mouse-move="mouseMove"
		:wheel-resize="wheelResize"
		:events-filter="eventsFilter"
		@move="$emit('move', $event)"
		@resize="$emit('resize', $event)"
	>
		<slot />
		<div class="cropper-event-notification" :class="{ 'cropper-event-notification--visible': notificationVisible }">
			{{
				notificationType === 'wheel'
					? 'Use ctrl + scroll to zoom the cropper'
					: 'Use two fingers to move the cropper'
			}}
		</div>
	</transformable-image>
</template>

<style lang="scss">
.cropper-event-notification {
	background: rgba(0, 0, 0, 0.6);
	color: white;
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	font-size: 20px;
	transition: opacity 0.5s;
	opacity: 0;
	pointer-events: none;
	padding-left: 50px;
	padding-right: 50px;

	&--visible {
		pointer-events: all;
		opacity: 1;
	}
}
</style>
