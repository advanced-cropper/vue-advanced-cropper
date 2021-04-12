<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		ExampleWrapper,
		Cropper,
	},
	data() {
		return {
			image:
				'https://images.unsplash.com/photo-1494205577727-d32e58564756?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
			limitations: {
				minWidth: 50,
				minHeight: 50,
			},
			result: null,
		};
	},
	methods: {
		percentsRestriction({ minWidth, minHeight, maxWidth, maxHeight, imageSize }) {
			return {
				maxWidth: (imageSize.width * (maxWidth || 100)) / 100,
				maxHeight: (imageSize.height * (maxHeight || 100)) / 100,
				minWidth: (imageSize.width * (minWidth || 0)) / 100,
				minHeight: (imageSize.height * (minHeight || 0)) / 100,
			};
		},
		onCrop({ canvas }) {
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
	<example-wrapper
		class="custom-restrictions-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/custom-restrictions-example.vue"
	>
		<cropper
			class="custom-restrictions-cropper"
			check-orientation
			:src="image"
			:max-height="limitations.maxHeight"
			:max-width="limitations.maxWidth"
			:min-height="limitations.minHeight"
			:min-width="limitations.minWidth"
			:size-restrictions-algorithm="percentsRestriction"
			@change="onCrop"
		/>
		<div class="panel">
			<div class="panel__left">
				<div class="input">
					<span class="input__label">Min width</span>
					<input v-model="limitations.minWidth" class="input__control" type="text" />
				</div>
				<div class="input">
					<span class="input__label">Min height</span>
					<input v-model="limitations.minHeight" class="input__control" type="text" />
				</div>
				<div class="input">
					<span class="input__label">Max width</span>
					<input v-model="limitations.maxWidth" class="input__control" type="text" />
				</div>
				<div class="input">
					<span class="input__label">Max height</span>
					<input v-model="limitations.maxHeight" class="input__control" type="text" />
				</div>
			</div>
			<div class="panel__right">
				<div class="button" @click="$refs.file.click()">
					<input ref="file" type="file" accept="image/*" @change="uploadImage($event)" />
					Upload image
				</div>
				<div v-if="this.result" class="button" @click="showImage()">Download result</div>
			</div>
		</div>
	</example-wrapper>
</template>

<style lang="scss">
.custom-restrictions-example {
	.panel {
		border: solid 1px #ddd;
		color: black;
		display: flex;
		padding: 20px;
		background: rgb(250, 250, 250);
		&__left {
			width: 100%;
			padding-right: 30px;
		}
		&__right {
			display: flex;
			align-items: stretch;
			flex-direction: column;
		}
	}

	.input {
		margin-bottom: 8px;
		&__control {
			padding: 4px;
			width: 100%;
			color: black;
			font: inherit;
			font-size: 15px;
			border: solid 1px #aaa;
		}
		&__label {
			display: block;
			font-size: 11px;
			margin-bottom: 3px;
		}
	}
	.custom-restrictions-cropper {
		width: 100%;
		max-height: 500px;
		border: solid 1px #eee;
	}

	.button {
		width: 120px;
		margin-top: 15px;
		color: white;
		font-size: 16px;
		padding: 17px 20px;
		text-align: center;
		background: #1f8255;
		cursor: pointer;
		transition: background 0.5s;
		font-weight: normal;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
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
