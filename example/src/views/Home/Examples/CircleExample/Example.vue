<template>
	<Cropper 
		classname="circle-example"
		:src="require('./assets/image.jpg')"
		:stencil-component="this.stencil"
		@change="change"
	/>
</template>

<script>
import Cropper from "vue-advanced-cropper";
import CircleStencil from "./CircleStencil";

export default {
  name: 'circle-example',
  components: {
	  Cropper,
	  CircleStencil
  },
  data() {
	  return {
		  stencil: CircleStencil
	  }
  }
}
</script>

<style lang="scss">
.circle-example {
  background: black;
}
</style>
