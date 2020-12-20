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
				'https://images.unsplash.com/photo-1602718571797-49d5e9d54563?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjcyNTgzfQ&auto=format&fit=crop&w=1024&q=80',
		};
	},
	methods: {
		boundaries({ cropper, imageSize }) {
			return {
				width: cropper.clientWidth,
				height: cropper.clientHeight,
			};
		},
		defaultVisibleArea() {
			return {
				height: 649,
				left: 63,
				top: 668,
				width: 800,
			};
		},
	},
};
</script>

<template>
	<example-wrapper
		class="default-visible-area-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/default-visible-area-example.vue"
	>
		<cropper
			:src="img"
			:default-visible-area="defaultVisibleArea"
			default-boundaries="fill"
			priority="visible-area"
		/>
	</example-wrapper>
</template>

<style>
.default-visible-area-example {
	height: 500px;
}
</style>
