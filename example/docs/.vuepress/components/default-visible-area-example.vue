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
			defaultVisibleArea() {
				return {
					width: 1404,
					height: 2108,
					left: 341,
					top: 6
				};
			},
			defaultPosition() {
				return {
					width: 1123,
					height: 1121,
					left: 500,
					top: 254,
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
			:default-position="defaultPosition"
		/>
	</div>
</template>

<style>
	.default-visible-area-example {
		height: 500px;
		border: solid 1px #EEE;
	}
</style>

