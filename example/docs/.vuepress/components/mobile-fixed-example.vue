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
				'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
		};
	},
};
</script>

<template>
	<example-wrapper
		class="mobile-fixed-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/mobile-fixed-example.vue"
	>
		<cropper
			:src="img"
			:stencil-size="{
				width: 300,
				height: 300,
			}"
			:stencil-props="{
				handlers: {},
				movable: false,
				resizable: false,
				aspectRatio: 1,
			}"
			image-restriction="stencil"
		/>
	</example-wrapper>
</template>
