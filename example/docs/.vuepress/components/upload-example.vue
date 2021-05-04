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
			const { files } = event.target;
			// Ensure that you have a file before attempting to read it
			if (files && files[0]) {
				// 1. Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
				if (this.image.src) {
					URL.revokeObjectURL(this.image.src);
				}
				// 2. Create the blob link to the file to optimize performance:
				const blob = URL.createObjectURL(files[0]);

				// 3. The steps below are designated to determine a file mime type to use it during the
				// getting of a cropped image from the canvas. You can replace it them by the following string,
				// but the type will be derived from the extension and it can lead to an incorrect result:
				//
				// this.image = {
				//    src: blob;
				//    type: files[0].type
				// }

				// Create a new FileReader to read this image binary data
				const reader = new FileReader();
				// Define a callback function to run, when FileReader finishes its job
				reader.onload = (e) => {
					// Note: arrow function used here, so that "this.image" refers to the image of Vue component
					this.image = {
						// Read image as base64 and set it as src:
						src: blob,
						// Determine the image type to preserve it during the extracting the image from canvas:
						type: getMimeType(e.target.result, files[0].type),
					};
				};
				// Start the reader job - read file as a data url (base64 format)
				reader.readAsArrayBuffer(files[0]);
			}
		},
	},
	destroyed() {
		// Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
		if (this.image.src) {
			URL.revokeObjectURL(this.image.src);
		}
	},
};
</script>

<template>
	<example-wrapper
		:no-border="true"
		class="upload-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/upload-example.vue"
	>
		<div class="upload-example__cropper-wrapper">
			<cropper ref="cropper" class="upload-example__cropper" check-orientation :src="image.src" />
			<div class="upload-example__reset-button" title="Reset Image" @click="reset()">
				<img :src="require('../assets/icons/reset.svg')" />
			</div>
			<div class="upload-example__file-type" v-if="image.type">
				{{ image.type }}
			</div>
		</div>
		<div class="upload-example__buttons-wrapper">
			<button class="upload-example__button" @click="$refs.file.click()">
				<input ref="file" type="file" accept="image/*" @change="loadImage($event)" />
				Upload image
			</button>
			<button v-if="image.src" class="upload-example__button" @click="crop()">Download result</button>
		</div>
	</example-wrapper>
</template>

<style lang="scss">
.upload-example {
	margin-top: 20px;
	margin-bottom: 20px;
	user-select: none;

	&__cropper {
		border: solid 1px #eee;
		min-height: 300px;
		max-height: 500px;
		width: 100%;
	}

	&__cropper-wrapper {
		position: relative;
	}

	&__reset-button {
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

	&__buttons-wrapper {
		display: flex;
		justify-content: center;
		margin-top: 17px;
	}

	&__button {
		border: none;
		outline: solid transparent;
		color: white;
		font-size: 16px;
		padding: 10px 20px;
		background: #3fb37f;
		cursor: pointer;
		transition: background 0.5s;
		margin: 0 16px;
		&:hover,
		&:focus {
			background: #38d890;
		}
		input {
			display: none;
		}
	}

	&__file-type {
		position: absolute;
		top: 20px;
		left: 20px;
		background: #0d0d0d;
		border-radius: 5px;
		padding: 0px 10px;
		padding-bottom: 2px;
		font-size: 12px;
		color: white;
	}
}
</style>
