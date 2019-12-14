<script>
import { RoundStencil, Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
			limitations: {
				minWidth: 400,
				minHeight: 400,
			},
			result: null,
		};
	},
	methods: {
		pixelsRestriction({minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight}) {
			return {
				minWidth: minWidth,
				minHeight: minHeight,
				maxWidth: maxWidth,
				maxHeight: maxHeight,
			};
		},
		onCrop({ canvas, }) {
			this.result = canvas.toDataURL();
		},
		showImage() {
			const newTab = window.open();
			newTab.document.body.innerHTML = `<img src="${this.result}"></img>`;
		},
		uploadImage(event) {
			// Reference to the DOM input element
			var input = event.target;
			// Ensure that you have a file before attempting to read it
			if (input.files && input.files[0]) {
				// create a new FileReader to read this image and convert to base64 format
				var reader = new FileReader();
				// Define a callback function to run, when FileReader finishes its job
				reader.onload = (e) => {
					// Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
					// Read image as base64 and set to imageData
					this.image = e.target.result;
				};
				// Start the reader job - read file as a data url (base64 format)
				reader.readAsDataURL(input.files[0]);
			}
		},
	},
};
</script>

<template>
  <div class="custom-restrictions-example">
    <Cropper
      classname="custom-restrictions-cropper"
      :src="image"
      :restrictions="pixelsRestriction"
      :max-height="limitations.maxHeight"
      :max-width="limitations.maxWidth"
      :min-height="limitations.minHeight"
      :min-width="limitations.minWidth"
      check-orientation
      @change="onCrop"
    />
    <div class="panel">
      <div class="panel__left">
        <div class="input">
          <span class="input__label">Min width</span>
          <input
            v-model="limitations.minWidth"
            class="input__control"
            type="text"
          ></input>
        </div>
        <div class="input">
          <span class="input__label">Min height</span>
          <input
            v-model="limitations.minHeight"
            class="input__control"
            type="text"
          ></input>
        </div>
        <div class="input">
          <span class="input__label">Max width</span>
          <input
            v-model="limitations.maxWidth"
            class="input__control"
            type="text"
          ></input>
        </div>
        <div class="input">
          <span class="input__label">Max height</span>
          <input
            v-model="limitations.maxHeight"
            class="input__control"
            type="text"
          ></input>
        </div>
      </div>
      <div class="panel__right">
        <div
          class="button"
          @click="$refs.file.click()"
        >
          <input
            ref="file"
            type="file"
            accept="image/*"
            @change="uploadImage($event)"
          >
          Upload image
        </div>
        <div
          v-if="this.result"
          class="button"
          @click="showImage()"
        >
          Download result
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.custom-restrictions-example {
	margin-top: 20px;
	margin-bottom: 20px;

	.panel {
		color: white;
		display: flex;
		padding: 20px;
		background: #3fb37f;
		&__left {
			width: 100%;
			padding-right: 30px;
		}
	}

	.input {
		margin-bottom: 3px;
		&__control {
			padding: 4px;
			width: 100%;
			border: none;
			color: black;
			font: inherit;
			font-size: 15px;
		}
		&__label {
			display: block;
			font-size: 11px;
		}
	}
	.custom-restrictions-cropper {
		width: 100%;
		max-height: 500px;
		border: solid 1px #EEE;
	}

	.button {
		width: 120px;
		margin-top: 15px;
		display: block;
		color: white;
		font-size: 16px;
		padding: 17px 20px;
		text-align: center;
		background: #1f8255;
		cursor: pointer;
		transition: background 0.5s;
		font-weight: normal;
		&:hover {
			background: #26a069;
			text-decoration: none !important;
		}
		input {
			display: none;
		}
	}
}
</style>
