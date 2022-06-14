<script>
import { BoundingBox } from 'vue-advanced-cropper';

export default {
	name: 'BoundingBoxExample',
	components: {
		BoundingBox,
	},
};
</script>

<template>
	<div class="bounding-box-example">
		<bounding-box
			:lines-classes="{
				default: 'line',
			}"
			:handlers-classes="{
				default: 'handler',
			}"
		>
			<div class="box" />
		</bounding-box>
	</div>
</template>

<style lang="scss">
.bounding-box-example {
	height: 100px;
	width: 100px;
	padding: 20px;
	.line {
		border-color: rgba(#3fb37f, 0.5);
	}
	.handler {
		background: #3fb37f;
	}
}
</style>
