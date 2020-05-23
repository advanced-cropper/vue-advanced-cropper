<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
		};
	},
};
</script>

<template>
  <div class='mobile-fixed-example'>
    <Cropper
      :src="img"
      :stencil-props="{
		  handlers: {},
		  movable: false,
		  scalable: false,
		  aspectRatio: 1,
      }"
      image-restriction="stencil"
    />
  </div>
</template>

<style lang="scss">
	.mobile-fixed-example {

	}
</style>
