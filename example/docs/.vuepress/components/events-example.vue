<script>
	import { Cropper } from 'vue-advanced-cropper';

	export default {
		components: {
			Cropper,
		},
		data() {
			return {
				img: {
					src: 'https://images.pexels.com/photos/1055424/pexels-photo-1055424.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
					loading: false
				}
			};
		},
		watch: {
			'img.src'(value) {
				if (value) {
					this.img.loading = true;
				}
			}
		},
		methods: {
			change({ coordinates, canvas }) {
				console.log('Coordinates was changed', coordinates, canvas);
			},
			error() {
				console.log('There is error during image loading');
				this.img.loading = false;
			},
			ready() {
				console.log('Image is successfully loaded');
				this.img.loading = false;
			}
		},
	};
</script>

<template>
	<div class="events-example">
		<input v-model="img.src">
		<div class="cropper-wrapper">
			<img class="cropper-wrapper__loading" src="../assets/tutorials/loading.svg" v-if="img.loading">
			<Cropper
				:src="img.src"
				@ready="ready"
				@error="error"
				@change="change"
			/>
		</div>
	</div>
</template>

<style lang="scss">
	.events-example {
		.cropper-wrapper {
			position: relative;
			background: #282C34;
			overflow: hidden;
			min-height: 300px;
		}
		.cropper-wrapper__loading {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
		}
		input {
			display: block;
			background: white;
			border-radius: 10px;
			border: solid 1px #EEE;
			padding: 8px 16px;
			outline: none;
			margin-bottom: 10px;
			width: 100%;
			text-overflow: ellipsis;
		}
	}

</style>
