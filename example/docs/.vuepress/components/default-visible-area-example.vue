<script>
	import { Cropper } from 'vue-advanced-cropper';

	export default {
		components: {
			Cropper,
		},
		data() {
			return {
				img: require('../assets/pictures/girl-at-the-beach.jpg'),
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
					width: 1049,
					height: 902,
					left: 454,
					top: 552,
				}
			}
		},
	};
</script>

<template>
	<div class="default-visible-area-example">
		<Cropper
			:src="img"
			:default-visible-area="defaultVisibleArea"
			:default-boundaries="boundaries"
		/>
	</div>
</template>

<style>
	.default-visible-area-example {
		height: 500px;
		border: solid 1px #EEE;
	}
</style>

