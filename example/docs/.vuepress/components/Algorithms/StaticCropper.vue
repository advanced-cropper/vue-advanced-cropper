<template>
	<div class="static-cropper">
		<slot />
	</div>
</template>

<style lang="scss">
@import '../../styles/constants';
.static-cropper {
	border: solid 1px $cropper-color;
	text-align: center;
	position: relative;
	user-select: none;
	max-height: 100%;
	max-width: 100%;
	direction: ltr;
	overflow: hidden;
}
</style>
