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
			img: require('../assets/pictures/ball.png'),
		};
	},
};
</script>

<template>
	<example-wrapper
		class="alpha-cropper-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/circle-example.vue"
	>
		<cropper :src="img" class="cropper" background-class="cropper__background" image-restriction="none" />
	</example-wrapper>
</template>

<style lang="scss">
.alpha-cropper-example {
	.cropper {
		&__background {
			background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC);
		}
	}
}
</style>
