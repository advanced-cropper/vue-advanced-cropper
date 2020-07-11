<script>
	import {
		PreviewResult,
		BoundingBox,
		DraggableArea
	} from 'vue-advanced-cropper';

	export default {
		components: {
			PreviewResult, BoundingBox, DraggableArea
		},
		props: [
			// Image src
			'img',
			// Stencil size desired by cropper
			'stencilCoordinates',
			// Aspect ratios
			'aspectRatio', 'minAspectRatio', 'maxAspectRatio',
		],
		computed: {
			style() {
				const { height, width, left, top } = this.stencilCoordinates;
				return {
					position: 'absolute',
					width: `${width}px`,
					height: `${height}px`,
					left: `${left}px`,
					top: `${top}px`
				};
			}
		},
		methods: {
			onMove(moveEvent) {
				this.$emit('move', moveEvent)
			},
			onResize(resizeEvent) {
				this.$emit('resize', resizeEvent)
			},
			aspectRatios() {
				return {
					minimum: this.aspectRatio || this.minAspectRatio,
					maximum: this.aspectRatio || this.maxAspectRatio,
				}
			}
		},
	};
</script>

<template>
	<div :style="style">
		<BoundingBox @resize="onResize">
			<DraggableArea @move="onMove">
				<PreviewResult
					:img="img"
					:stencil-coordinates="stencilCoordinates"
				/>
			</DraggableArea>
		</BoundingBox>
	</div>
</template>
