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
				'https://images.unsplash.com/photo-1600353068867-5b4de71e3afb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80',
			size: {
				width: null,
				height: null,
			},
		};
	},
	methods: {
		flip(x, y) {
			if (this.$refs.cropper.customImageTransforms.rotate % 180 !== 0) {
				this.$refs.cropper.flip(!x, !y);
			} else {
				this.$refs.cropper.flip(x, y);
			}
		},
		rotate(angle) {
			this.$refs.cropper.rotate(angle);
		},
		download() {
			const result = this.$refs.cropper.getResult().canvas.toDataURL();
			const newTab = window.open();
			newTab.document.body.innerHTML = `<img src="${result}"></img>`;
		},
		change(args) {
			console.log(args);
		},
	},
};
</script>

<template>
	<example-wrapper
		class="rotate-image-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/rotate-image-example.vue"
	>
		<cropper
			ref="cropper"
			class="cropper"
			:src="image"
			:transitions="true"
			image-restriction="fit-area"
			@change="change"
		/>
		<vertical-buttons>
			<square-button title="Flip Horizontal" @click="flip(true, false)">
				<img :src="require('../assets/icons/flip-horizontal.svg')" />
			</square-button>
			<square-button title="Flip Vertical" @click="flip(false, true)">
				<img :src="require('../assets/icons/flip-vertical.svg')" />
			</square-button>
			<square-button title="Rotate Clockwise" @click="rotate(90)">
				<img :src="require('../assets/icons/rotate-clockwise.svg')" />
			</square-button>
			<square-button title="Rotate Counter-Clockwise" @click="rotate(-90)">
				<img :src="require('../assets/icons/rotate-counter-clockwise.svg')" />
			</square-button>
			<square-button title="Download" @click="download()">
				<img :src="require('../assets/icons/download.svg')" />
			</square-button>
		</vertical-buttons>
	</example-wrapper>
</template>

<style lang="scss">
.rotate-image-example {
	.cropper {
		max-height: 500px;
	}
}
</style>
