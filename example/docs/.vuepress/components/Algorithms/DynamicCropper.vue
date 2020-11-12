<template>
	<bounding-box
		v-bind="$attrs"
		v-on="$listeners"
		class="dynamic-cropper"
		:lines-classes="{
			default: 'dynamic-cropper__line',
		}"
		:handlers-classes="{
			default: 'dynamic-cropper__handler',
		}"
	>
		<slot />
	</bounding-box>
</template>

<style lang="scss">
@import '../../styles/constants';
.dynamic-cropper {
	position: absolute;
	&__line {
		border-color: $cropper-color;
	}
	&__handler {
		background: $cropper-color;
	}
}
</style>

<script>
import { BoundingBox } from 'vue-advanced-cropper';
export default {
	components: {
		BoundingBox,
	},
};
</script>
