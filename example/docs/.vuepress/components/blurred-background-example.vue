<script>
import { RoundStencil, Cropper } from 'vue-advanced-cropper'

export default {
	data() {
		return {
			img: 'https://images.pexels.com/photos/245388/pexels-photo-245388.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
		}
	},
	components: {
		Cropper
	}
}
</script>

<template>
<div class="blurred-background-cropper">
	<div class="cropper-wrapper">
		<div :style="{backgroundImage: 'url(' + img + ')'}" class="cropper-background"></div>
		<Cropper
			:src="img"
			backgroundClassname="image-background"
		/>
	</div>
</div>
</template>

<style lang="scss">
	.blurred-background-cropper {
		.cropper-wrapper {
			overflow: hidden;
			position: relative;
			height: 400px;
			background: black;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.cropper-background {
			position: absolute;
			width: 100%;
			height: 100%;
			background-size: cover;
			background-position: 50%;
			filter: blur(5px);
			opacity: 0.25;
		}
	}
</style>
