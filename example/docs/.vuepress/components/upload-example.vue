<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		Cropper,
		ExampleWrapper,
	},
	data() {
		return {
			image: null,
		};
	},
	methods: {
		reset() {
			this.image = null;
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
	<div class="upload-example">
		<div class="cropper-wrapper">
			<Cropper class="upload-example-cropper" check-orientation :src="image" />
			<div class="reset-button" title="Reset Image" @click="reset()">
				<img :src="require('../assets/icons/reset.svg')" />
			</div>
		</div>
		<div class="button-wrapper">
			<span class="button" @click="$refs.file.click()">
				<input ref="file" type="file" accept="image/*" @change="uploadImage($event)" />
				Upload image
			</span>
		</div>
	</div>
</template>

<style lang="scss">
.upload-example {
	margin-top: 20px;
	margin-bottom: 20px;
	user-select: none;

	.upload-example-cropper {
		border: solid 1px #eee;
		min-height: 300px;
		max-height: 500px;
		width: 100%;
	}

	.cropper-wrapper {
		position: relative;
	}

	.reset-button {
		position: absolute;
		right: 20px;
		bottom: 20px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		width: 42px;
		background: rgba(#3fb37f, 0.7);
		transition: background 0.5s;
		&:hover {
			background: #3fb37f;
		}
	}

	.button-wrapper {
		display: flex;
		justify-content: center;
		margin-top: 17px;
	}

	.button {
		color: white;
		font-size: 16px;
		padding: 10px 20px;
		background: #3fb37f;
		cursor: pointer;
		transition: background 0.5s;
	}

	.button:hover {
		background: #38d890;
	}

	.button input {
		display: none;
	}
}
</style>
