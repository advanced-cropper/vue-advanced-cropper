<template>
  <div class="home">
    <div class="cropper-wrapper">
      <Cropper 
        :src="require('../assets/test3.png')"
        :min-aspect-ratio="12/16"
        :max-aspect-ratio="16/16"
        cropper-class="cropper"
        image-class="cropper__image"
        min-width="100"
        min-height="100"
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