<template>
	<div class="example-wrapper">
		<slot />
	</div>
</template>

<style lang="scss">
.example-wrapper {
	position: relative;
	user-select: none;
	border: solid 1px #eee;
	margin-top: 20px;
	margin-bottom: 20px;
}
</style>
