<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';
import { saveAs } from 'file-saver';

// This function is used to detect the actual image type,
function getMimeType(file, fallback = null) {
	const byteArray = new Uint8Array(file).subarray(0, 4);
	let header = '';
	for (let i = 0; i < byteArray.length; i++) {
		header += byteArray[i].toString(16);
	}
	switch (header) {
		case '89504e47':
			return 'image/png';
		case '47494638':
			return 'image/gif';
		case 'ffd8ffe0':
		case 'ffd8ffe1':
		case 'ffd8ffe2':
		case 'ffd8ffe3':
		case 'ffd8ffe8':
			return 'image/jpeg';
		default:
			return fallback;
	}
}

export default {
	components: {
		Cropper,
		ExampleWrapper,
	},
	data() {
		return {
			image: {
				src: null,
				type: null,
			},
		};
	},
	methods: {
		crop() {
			const { canvas } = this.$refs.cropper.getResult();
			canvas.toBlob((blob) => {
				saveAs(blob);
			}, this.image.type);
		},
		reset() {
			this.image = {
				src: null,
				type: null,
			};
		},
		loadImage(event) {
			// Reference to the DOM input element
			const input = event.target;
			// Ensure that you have a file before attempting to read it
			if (input.files && input.files[0]) {
				// create a new FileReader to read this image and convert to base64 format
				const reader = new FileReader();
				// Define a callback function to run, when FileReader finishes its job
				reader.onload = (e) => {
					// Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
					this.image = {
						// Read image as base64 and set it as src:
						src: e.target.result,
						// Determine the image type to preserve it during the extracting the image from canvas:
						type: getMimeType(e.target.result, input.files[0].type),
					};
				};
				// Start the reader job - read file as a data url (base64 format)
				reader.readAsDataURL(input.files[0]);
			}
		},
	},
};
</script>

<template>
	<example-wrapper
		:no-border="true"
		class="upload-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/upload-example.vue"
	>
		<div class="cropper-wrapper">
			<cropper ref="cropper" class="upload-example-cropper" check-orientation :src="image.src" />
			<div class="reset-button" title="Reset Image" @click="reset()">
				<img :src="require('../assets/icons/reset.svg')" />
			</div>
		</div>
		<div class="button-wrapper">
			<button class="button" @click="$refs.file.click()">
				<input ref="file" type="file" accept="image/*" @change="loadImage($event)" />
				Upload image
			</button>
			<button v-if="image.src" class="button" @click="crop()">Download result</button>
		</div>
	</example-wrapper>
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
		border: none;
		outline: solid transparent;
		color: white;
		font-size: 16px;
		padding: 10px 20px;
		background: #3fb37f;
		cursor: pointer;
		transition: background 0.5s;
		margin: 0 16px;
	}

	.button:hover,
	.button:focus {
		background: #38d890;
	}

	.button input {
		display: none;
	}
}
</style>
