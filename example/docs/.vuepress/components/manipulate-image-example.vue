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
				'https://images.unsplash.com/photo-1538888649860-8fb12eb67541?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1011&q=80',
			size: {
				width: null,
				height: null,
			},
		};
	},
	methods: {
		boundaries({ cropper, imageSize }) {
			return {
				width: cropper.clientWidth,
				height: cropper.clientHeight,
			};
		},
		updateSize({ coordinates }) {
			this.size.width = Math.round(coordinates.width);
			this.size.height = Math.round(coordinates.height);
		},
		zoom(factor) {
			this.$refs.cropper.zoom(factor);
		},
		move(direction) {
			if (direction === 'left') {
				this.$refs.cropper.move(-this.size.width / 4);
			} else if (direction === 'right') {
				this.$refs.cropper.move(this.size.width / 4);
			} else if (direction === 'top') {
				this.$refs.cropper.move(0, -this.size.height / 4);
			} else if (direction === 'bottom') {
				this.$refs.cropper.move(0, this.size.height / 4);
			}
		},
	},
};
</script>

<template>
	<example-wrapper
		class="manipulate-image-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/manipulate-image-example.vue"
	>
		<cropper
			ref="cropper"
			class="coordinates-cropper"
			:src="image"
			:default-boundaries="boundaries"
			:transitions="true"
			:stencil-props="{
				minAspectRatio: 10 / 20,
			}"
			@change="updateSize"
		/>
		<vertical-buttons>
			<square-button title="Zoom In" @click="zoom(2)">
				<img :src="require('../assets/icons/zoom-in.svg')" />
			</square-button>
			<square-button title="Zoom Out" @click="zoom(0.5)">
				<img :src="require('../assets/icons/zoom-out.svg')" />
			</square-button>
			<square-button title="Move Top" @click="move('top')">
				<img :src="require('../assets/icons/arrow-top.svg')" />
			</square-button>
			<square-button title="Move Left" @click="move('left')">
				<img :src="require('../assets/icons/arrow-left.svg')" />
			</square-button>
			<square-button title="Move Right" @click="move('right')">
				<img :src="require('../assets/icons/arrow-right.svg')" />
			</square-button>
			<square-button title="Move Bottom" @click="move('bottom')">
				<img :src="require('../assets/icons/arrow-bottom.svg')" />
			</square-button>
		</vertical-buttons>
		<div class="size-info" v-if="size.width && size.height">
			<div>Width: {{ size.width }}px</div>
			<div>Height: {{ size.height }}px</div>
		</div>
	</example-wrapper>
</template>

<style lang="scss">
.manipulate-image-example {
	.coordinates-cropper {
		max-height: 500px;
		background: black;
	}
	.size-info {
		color: white;
		position: absolute;
		font-size: 10px;
		right: 10px;
		bottom: 10px;
		opacity: 0.5;
	}
}
</style>
