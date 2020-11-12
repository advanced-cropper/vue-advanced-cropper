<template>
	<div class="static-boundaries">
		<slot />
	</div>
</template>

<style lang="scss">
@import '../../styles/constants';
.static-boundaries {
	border: dashed 1px $boundaries-color;
}
</style>
