<script>
	import { RoundStencil, Cropper } from 'vue-advanced-cropper';

	export default {
		components: {
			Cropper,
		},
		data() {
			return {
				image: require('../assets/pictures/girl-in-green.jpg'),
				size: {
					width: null,
					height: null
				},
			};
		},
		methods: {
			updateSize({coordinates}) {
				this.size.width = Math.round(coordinates.width)
				this.size.height = Math.round(coordinates.height)
			},
			zoom(factor) {
				this.$refs.cropper.zoom(factor)
			},
			move(direction) {
				if (direction === 'left') {
					this.$refs.cropper.move(-this.size.width / 4)
				} else if (direction === 'right') {
					this.$refs.cropper.move(this.size.width / 4)
				} else if (direction === 'top') {
					this.$refs.cropper.move(0, -this.size.height / 4)
				} else if (direction === 'bottom') {
					this.$refs.cropper.move(0, this.size.height / 4)
				}
			},
		},
	};
</script>

<template>
	<div class="set-coordinates-example">
		<Cropper
			ref="cropper"
			classname="coodinates-cropper"
			:src="image"
			:stencil-props="{
			minAspectRatio: 10/20,
		}"
			@change="updateSize"
		/>
		<div class="buttons">
			<div class="button" title="Zoom In" @click="zoom(2)">
				<img :src="require('../assets/icons/zoom-in.svg')"/>
			</div>
			<div class="button" title="Zoom Out" @click="zoom(0.5)">
				<img :src="require('../assets/icons/zoom-out.svg')"/>
			</div>
			<div class="button" title="Move Top" @click="move('top')">
				<img :src="require('../assets/icons/arrow-top.svg')"/>
			</div>
			<div class="button" title="Move Left" @click="move('left')">
				<img :src="require('../assets/icons/arrow-left.svg')"/>
			</div>
			<div class="button" title="Move Right" @click="move('right')">
				<img :src="require('../assets/icons/arrow-right.svg')"/>
			</div>
			<div class="button" title="Move Bottom" @click="move('bottom')">
				<img :src="require('../assets/icons/arrow-bottom.svg')"/>
			</div>
		</div>
		<div class="size-info" v-if="size.width && size.height">
			<div>Width: {{size.width}}px</div>
			<div>Height: {{size.height}}px</div>
		</div>
	</div>
</template>

<style lang="scss">
	.manipulate-image-example {
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
