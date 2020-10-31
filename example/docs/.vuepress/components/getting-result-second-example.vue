<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80',
			coordinates: {
				width: 0,
				height: 0,
				left: 0,
				top: 0,
			},
			image: null,
		};
	},
	methods: {
		crop() {
			const { coordinates, canvas, } = this.$refs.cropper.getResult();
			this.coordinates = coordinates;
			// You able to do different manipulations at a canvas
			// but there we just get a cropped image
			this.image = canvas.toDataURL();
		},
	},
};
</script>

<template>
  <div class="getting-result-second-example">
    <Cropper
      ref="cropper"
      :src="img"
      :stencil-props="{
        aspectRatio: 1
      }"
    />
    <div class="results-wrapper">
      <div
        v-if="this.image"
        class="results"
      >
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
      <div
        v-if="this.image"
        class="preview"
      >
        <img
          :src="this.image"
          alt=""
        >
      </div>
    </div>

    <div
      class="button"
      @click="crop"
    >
      Crop Image
    </div>
  </div>
</template>

<style lang="scss">
@import "../styles/grid";
.getting-result-second-example {
	position: relative;
	.results-wrapper {
		display: flex;
		position: absolute;
		right: 15px;
		bottom: 15px;
		border: dashed 1px rgba(white, 0.5);
	}
	.results {
		background: rgba(black, 0.8);
		padding: 5px;
		font-size: 10px;
		color: white;
		pointer-events: none;
		@media (max-width: $screen-sm) {
			display: none;
		}
	}
	.preview {
		width: 107px;
		height: 107px;
		opacity: 0.9;
		pointer-events: none;
		box-sizing: border-box;
		img {
			width: 100%;
			height: 100%;
		}
	}
	p {
		margin-top: 2px;
		margin-bottom: 2px;
	}

	.button {
		display: flex;
		justify-content: center;
		margin-top: 10px;
		position: absolute;
		left: 50%;
		top: -10px;
		transform: translateX(-50%);
		background: rgba(black,0.8);
		padding: 5px 20px;
		transition: background 0.5s;
		color: white;
		font-size: 16px;
		cursor: pointer;
		&:hover {
			background: rgba(#3fb37f, 0.9)
		}
	}
}
</style>
