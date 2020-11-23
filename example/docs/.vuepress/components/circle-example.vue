<script>
import { CircleStencil, Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		Cropper,
		ExampleWrapper,
	},
	data() {
		return {
			img:
				'https://images.unsplash.com/photo-1485178575877-1a13bf489dfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=991&q=80',
		};
	},
};
</script>

<template>
	<example-wrapper
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/circle-example.vue"
	>
		<cropper
			:src="img"
			:stencil-props="{
				previewClass: 'circle-cropper__preview',
			}"
			class="circle-cropper"
			stencil-component="circle-stencil"
		/>
	</example-wrapper>
</template>

<style lang="scss">
.circle-cropper {
	width: 100%;
	background: #222;
	&__preview {
		border: solid 1px rgba(white, 0.15);
	}
}
</style>
