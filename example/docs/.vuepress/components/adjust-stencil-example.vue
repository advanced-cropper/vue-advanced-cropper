<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';
import VerticalButtons from './Components/VerticalButtons';
import SquareButton from './Components/SquareButton';

export default {
	components: {
		Cropper,
		ExampleWrapper,
		VerticalButtons,
		SquareButton,
	},
	data() {
		return {
			image:
				require('../assets/pictures/photo-1596473322597-91d5b6938b8a.jpg'),
			adjustStencil: false,
		};
	},
};
</script>

<template>
	<example-wrapper
		class="adjust-stencil-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/adjust-stencil-example.vue"
	>
		<cropper
			ref="cropper"
			:src="image"
			:resize-image="{
				adjustStencil: adjustStencil,
			}"
			default-boundaries="fill"
			image-restriction="fit-area"
			:default-size="{
				width: 1024,
				height: 689,
			}"
			:default-position="{
				left: 19,
				top: 360,
			}"
			:default-visible-area="{
				width: 1024,
				height: 689,
				left: 19,
				top: 285,
			}"
		/>
		<label class="adjust-stencil-example__adjust">
			<input type="checkbox" v-model="adjustStencil" @change="$refs.cropper.reset()" />
			Adjust stencil
		</label>
	</example-wrapper>
</template>

<style lang="scss">
.adjust-stencil-example {
	height: 500px;
	position: relative;
	&__adjust {
		background: rgba(black, 0.7);
		padding: 10px 20px;
		position: absolute;
		left: 20px;
		top: 20px;
		color: white;
	}
}
</style>
