<template>
	<div class="group">
		<div class="group__label" v-if="label">
			{{ label }}
		</div>
		<slot />
	</div>
</template>

<style lang="scss">
@import '../../styles/constants';
.group {
	border: solid 1px #eee;
	margin-top: 2px;
	min-width: 200px;
	position: relative;
	padding: 10px 20px;
	margin-bottom: 10px;
	&__label {
		position: absolute;
		font-size: 12px;
		padding: 1px 10px;
		background: white;
		top: -10px;
		left: 50%;
		transform: translateX(-50%);
		max-width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
}
</style>

<script>
export default {
	props: ['label'],
};
</script>
