<script>
import { Cropper, Preview } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';
import Results from './Components/Results';
import VerticalButtons from './Components/VerticalButtons';
import SquareButton from './Components/SquareButton';

export default {
	components: {
		Results,
		Cropper,
		ExampleWrapper,
		VerticalButtons,
		SquareButton,
		Preview,
	},
	data() {
		return {
			img:
				'https://images.unsplash.com/photo-1590291409749-452efbe0d76c?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
			result: {
				coordinates: null,
				image: null,
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
		onChange({ coordinates, image }) {
			this.result = {
				coordinates,
				image,
			};
		},
		onCrop() {
			const result = this.$refs.cropper.getResult().canvas.toDataURL();
			const newTab = window.open();
			newTab.document.body.innerHTML = `<img src="${result}"></img>`;
		},
	},
};
</script>

<template>
	<example-wrapper
		class="preview-result-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/preview-result-example.vue"
	>
		<cropper
			ref="cropper"
			class="preview-result-example__cropper"
			:src="img"
			:debounce="false"
			:stencil-props="{
				aspectRatio: 1,
			}"
			@change="onChange"
		/>
		<div class="preview-result-example__previews">
			<preview class="preview-result-example__preview" :image="result.image" :coordinates="result.coordinates" />
			<preview
				class="preview-result-example__preview preview-result-example__preview--small"
				:image="result.image"
				:coordinates="result.coordinates"
			/>
		</div>
		<square-button class="preview-result-example__button" title="Download" @click="onCrop()">
			<img :src="require('../assets/icons/download.svg')" />
		</square-button>
	</example-wrapper>
</template>

<style lang="scss">
@import '../styles/grid';

.preview-result-example {
	display: flex;
	&__cropper {
		width: 300px;
	}
	&__previews {
		margin-left: 32px;
	}
	&__preview {
		border-radius: 50%;
		overflow: hidden;
		margin-top: 24px;
		margin-bottom: 24px;
		width: 100px;
		height: 100px;
		&--small {
			width: 60px;
			height: 60px;
		}
	}
	&__preview-image {
		width: 100%;
	}
	&__button {
		position: absolute;
		left: 16px;
		bottom: 0;
	}
}
</style>
