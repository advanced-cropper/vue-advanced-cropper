<template>
  <div class="home">
    <div class="cropper-wrapper">
      <Cropper 
        :src="require('../assets/test3.png')"
        cropper-class="cropper"
        image-class="cropper__image"
        :max-width="70"
        :max-height="70"
        :min-width="30"
        :min-height="30"
        :stencilProps="{
          minAspectRatio: 8/16,
          maxAspectRatio: 32/16,
        }"
        @change="change"
      />
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Cropper from 'vue-advanced-cropper'

export default {
  name: 'home',
  components: {
    HelloWorld,
    Cropper,
  },
  methods: {
    change(coordinates) {
      //console.log("CHANGE!", coordinates)
    }
  }
}
</script>

<style lang="scss">
  .cropper {
    background: black;
    border: solid 1px #AABBBB;
    width: 100%;  
    height: 400px;
  }

</style>