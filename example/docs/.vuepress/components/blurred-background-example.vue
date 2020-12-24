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
				'https://images.unsplash.com/photo-1542571255-84471dc5581c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80',
		};
	},
};
</script>

<template>
	<example-wrapper
		class="blurred-background-cropper"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/blurred-background-example.vue"
	>
		<div class="cropper-wrapper">
			<div :style="{ backgroundImage: 'url(' + img + ')' }" class="image-background" />
			<cropper :src="img" background-class="cropper-background" />
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
	}
	.cropper-background {
		background: none;
	}
	.image-background {
		position: absolute;
		width: calc(100% + 20px);
		height: calc(100% + 20px);
		left: -10px;
		top: -10px;
		background-size: cover;
		background-position: 50%;
		filter: blur(5px);
	}
}
</style>
