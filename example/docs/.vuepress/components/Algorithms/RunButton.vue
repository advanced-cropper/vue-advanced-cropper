<template>
	<div class="run-button" @click="$emit('click', $event)" v-bind="$attrs">
		<img :src="require('../../assets/icons/play.svg')" />
	</div>
</template>

<style lang="scss">
@import '../../styles/constants';
.run-button {
	background: rgba($vue-color, 0.9);
	display: flex;
	align-items: center;
	justify-content: center;
	height: 42px;
	width: 42px;
	border-radius: 50%;
	box-shadow: 0 0 6px 0px rgba(black, 0.2);
	cursor: pointer;
	transition: background 0.5s;
	position: absolute;
	right: 20px;
	bottom: 20px;
	&:hover {
		background: $vue-color;
	}
}
</style>
