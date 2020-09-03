<template>
  <Cropper
    class="circle-example"
    :src="require('./assets/image.jpg')"
    :stencil-component="stencil"
  />
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import CircleStencil from './CircleStencil';

export default {
	name: 'CircleExample',
	components: {
	  Cropper,
	},
	data() {
	  return {
		  stencil: CircleStencil,
	  };
	},
};
</script>

<style lang="scss">
.circle-example {
  background: black;
}
</style>
