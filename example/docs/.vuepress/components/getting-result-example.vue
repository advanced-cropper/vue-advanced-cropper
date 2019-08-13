<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.unsplash.com/photo-1533743409942-b91130480a7a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
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
		onChange({ coordinates, canvas, }) {
			this.coordinates = coordinates;
			this.image = canvas.toDataURL();
		},
	},
};
</script>

<template>
  <div class="getting-result-example">
    <Cropper
      :src="img"
      :stencil-props="{
        aspectRatio: 1
      }"
      @change="onChange"
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
        >>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "../styles/grid";

.getting-result-example {
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
