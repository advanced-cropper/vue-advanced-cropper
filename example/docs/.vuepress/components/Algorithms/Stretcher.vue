<template>
	<div class="stretcher" :class="{ 'stretcher--visible': visible }">
		<div class="stretcher__horizontal-line" v-show="visible"></div>
		<div class="stretcher__vertical-line" v-show="visible"></div>
	</div>
</template>

<style lang="scss">
@import '../../styles/constants';
.stretcher {
	display: block;
	position: relative;
	pointer-events: none;
	max-width: 100%;
	max-height: 100%;
	&--visible {
		border: dashed 1px rgba($stretcher-color, 0.3);
	}
	&__horizontal-line {
		height: 1px;
		border: dashed 1px $stretcher-color;
		width: 100%;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		&:before {
			left: 0;
		}
		&:after {
			right: 0;
		}
		&:before,
		&:after {
			content: '';
			display: block;
			background: white;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			border-left: solid 1px $stretcher-color;
			border-right: solid 1px $stretcher-color;
			width: 10px;
			height: 40px;
		}
	}
	&__vertical-line {
		width: 1px;
		border: dashed 1px $stretcher-color;
		height: 100%;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		&:before {
			top: 0;
		}
		&:after {
			bottom: 0;
		}
		&:before,
		&:after {
			content: '';
			display: block;
			background: white;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			border-top: solid 1px $stretcher-color;
			border-bottom: solid 1px $stretcher-color;
			width: 40px;
			height: 10px;
		}
	}
}
</style>

<script>
export default {
	props: ['visible'],
};
</script>
