<script>
import { RoundStencil, Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			image:
				'https://images.unsplash.com/photo-1532182657011-d3d31357b5d8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=696&q=80',
			size: {
				width: null,
				height: null,
			},
		};
	},
	methods: {
		updateSize({ coordinates }) {
			this.size.width = Math.round(coordinates.width);
			this.size.height = Math.round(coordinates.height);
		},
		resize(width = 1, height = 1) {
			let startCoordinates;
			this.$refs.cropper.setCoordinates([
				(coordinates, imageSize) => {
					startCoordinates = coordinates;
					return {
						width: coordinates.width * width,
						height: coordinates.height * height,
					};
				},
				(coordinates, imageSize) => ({
					left: startCoordinates.left + (startCoordinates.width - coordinates.width) / 2,
					top: startCoordinates.top + (startCoordinates.height - coordinates.height) / 2,
				}),
			]);
		},
		center() {
			this.$refs.cropper.setCoordinates((coordinates, imageSize) => ({
				left: imageSize.width / 2 - coordinates.width / 2,
				top: imageSize.height / 2 - coordinates.height / 2,
			}));
		},
		maximize() {
			const { cropper } = this.$refs;
			const center = {
				left: cropper.coordinates.left + cropper.coordinates.width / 2,
				top: cropper.coordinates.top + cropper.coordinates.height / 2,
			};
			cropper.setCoordinates([
				(coordinates, imageSize) => ({
					width: imageSize.width,
					height: imageSize.height,
				}),
				(coordinates, imageSize) => ({
					left: center.left - coordinates.width / 2,
					top: center.top - coordinates.height / 2,
				}),
			]);
		},
	},
};
</script>

<template>
	<div class="set-coordinates-example">
		<Cropper
			ref="cropper"
			class="coodinates-cropper"
			:src="image"
			:stencil-props="{
				minAspectRatio: 10 / 20,
			}"
			@change="updateSize"
		/>
		<div class="buttons">
			<div class="button" title="Resize (x2)" @click="resize(2, 2)">
				<img :src="require('../assets/icons/resize.svg')" />
			</div>
			<div class="button" title="Resize height (x2)" @click="resize(1, 2)">
				<img :src="require('../assets/icons/resize-vertical.svg')" />
			</div>
			<div class="button" title="Resize width (x2)" @click="resize(2, 1)">
				<img :src="require('../assets/icons/resize-horizontal.svg')" />
			</div>
			<div class="button" title="Resize (x1/2)" @click="resize(0.5, 0.5)">
				<img :src="require('../assets/icons/resize-reduce.svg')" />
			</div>
			<div class="button" title="Maximize" @click="maximize()">
				<img :src="require('../assets/icons/resize-maximize.svg')" />
			</div>
			<div class="button" title="Center" @click="center()">
				<img :src="require('../assets/icons/center.svg')" />
			</div>
		</div>
		<div class="size-info" v-if="size.width && size.height">
			<div>Width: {{ size.width }}px</div>
			<div>Height: {{ size.height }}px</div>
		</div>
	</div>
</template>

<style lang="scss">
.set-coordinates-example {
	margin-top: 20px;
	margin-bottom: 20px;
	position: relative;
	user-select: none;
	.coodinates-cropper {
		min-height: 400px;
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
	.button {
		background: rgba(black, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		width: 42px;
		margin-bottom: 10px;
		cursor: pointer;
		transition: background 0.5s;
		&:hover {
			background: black;
		}
	}
	.buttons {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
