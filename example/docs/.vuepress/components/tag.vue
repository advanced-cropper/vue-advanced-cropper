<template>
	<div class="tag-component">
		<slot />
	</div>
</template>

<style lang="scss">
@import '../styles/constants';
.tag-component {
	background: $vue-color;
	height: 26px;
	line-height: 26px;
	padding: 0 10px;
	border-radius: 3px;
	font-size: 12px;
	color: white;
	display: inline-block;
}
</style>
