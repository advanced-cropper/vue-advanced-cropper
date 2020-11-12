<template>
	<bounding-box
		v-bind="$attrs"
		v-on="$listeners"
		class="dynamic-area"
		:lines-classes="{
			default: 'dynamic-area__line',
		}"
		:handlers-classes="{
			default: 'dynamic-area__handler',
		}"
	>
		<slot />
	</bounding-box>
</template>

<style lang="scss">
@import '../../styles/constants';
.dynamic-area {
	position: absolute;
	&__line {
		border-color: $area-color;
	}
	&__handler {
		background: $area-color;
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
