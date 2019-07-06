<script>
import { Cropper } from 'vue-advanced-cropper'

export default {
	data() {
		return {
			img: 'https://images.pexels.com/photos/864938/pexels-photo-864938.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
			coordinates: {
				width: 0,
				height: 0,
				left: 0,
				top: 0
			},
			image: null
		}
	},
	methods: {
		onChange({coordinates, canvas}) {
			this.coordinates = coordinates
			this.image = canvas.toDataURL()
		}
	},
	components: {
		Cropper
	}
}
</script>

<template>
<div class="getting-result-example">
  <Cropper
	:src="img"
	:stencilProps="{
		aspectRatio: 1
	}"
	@change="onChange"
  />
  <div class="results" v-if="this.image">
	  <p><b>Results:</b></p>
	  <p>
		  Width: {{ coordinates.width }}
	  </p>
	  <p>
		  Height: {{ coordinates.height }}
	  </p>
	  <p>
		  Left: {{ coordinates.left }}
	  </p>
	  <p>
		  Top: {{ coordinates.top }}
	  </p>
  </div>
  <div class="preview" v-if="this.image">
	  <img :src="this.image" alt=""/>>
  </div>
</div>
</template>

<style lang="scss">
	.getting-result-example {
		position: relative;
		.results {
			background: rgba(black, 0.8);
			padding: 5px;
			position: absolute;
			right: 122px;
			bottom: 15px;
			font-size: 10px;
			color: white;
			pointer-events: none;
		}
		.preview {
			width: 107px;
			height: 107px;
			position: absolute;
			right: 15px;
			bottom: 15px;
			opacity: 0.8;
			pointer-events: none;
			img {
				width: 100%;
				height: 100%;
			}
		}
		p {
			margin-top: 2px;
			margin-bottom: 2px;
		}
	}

</style>
