<script>
import CircleStencil from './Home/Examples/CircleExample/CircleStencil';
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.pexels.com/photos/1451124/pexels-photo-1451124.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
			stencil: CircleStencil,
		};
	},
};
</script>

<template>
  <div class="advanced-stencil-example">
    <Cropper
      :src="img"
      :stencil-component="stencil"
    />
  </div>
</template>

<style lang="scss">
	.advanced-stencil-example {

	}
</style>
