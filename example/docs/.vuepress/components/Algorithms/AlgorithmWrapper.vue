<template>
	<div class="algorithm-wrapper">
		<div class="algorithm-wrapper__content">
			<slot name="content" />
		</div>
		<div class="algorithm-wrapper__panel">
			<slot name="panel" />
		</div>
	</div>
</template>

<style lang="scss">
.algorithm-wrapper {
	position: relative;
	user-select: none;
	border: solid 1px #eee;
	margin-top: 20px;
	margin-bottom: 20px;
	display: flex;
	&__content {
		width: 100%;
		position: relative;
	}
	&__panel {
		padding: 10px;
		border-left: solid 1px #eee;
	}
	@media (max-width: 1200px) {
		display: block;
	}
}
</style>
