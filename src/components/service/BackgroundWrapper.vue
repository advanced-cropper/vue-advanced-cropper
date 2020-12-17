<script>
import TransformableImage from './TransformableImage.vue';

export default {
	components: {
		TransformableImage,
	},
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
	},
	emits: ['resize', 'move'],
};
</script>

<template>
	<transformable-image
		:touch-move="touchMove"
		:touch-resize="touchResize"
		:mouse-move="mouseMove"
		:wheel-resize="wheelResize"
		@move="$emit('move', $event)"
		@resize="$emit('resize', $event)"
	>
		<slot />
	</transformable-image>
</template>
