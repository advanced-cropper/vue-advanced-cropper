<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		Cropper,
		ExampleWrapper,
	},
	data() {
		return {
			img:
				'https://images.unsplash.com/photo-1542571255-84471dc5581c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=295&q=80',
		};
	},
};
</script>

<template>
	<example-wrapper class="blurred-background-cropper">
		<div class="cropper-wrapper">
			<div :style="{ backgroundImage: 'url(' + img + ')' }" class="cropper-background" />
			<Cropper :src="img" background-class="image-background" />
		</div>
	</example-wrapper>
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
