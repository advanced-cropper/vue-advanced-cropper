<script>
import { Cropper } from 'vue-advanced-cropper';
import ExampleWrapper from './Components/ExampleWrapper';
import { saveAs } from 'file-saver';

export default {
	components: {
		Cropper,
		ExampleWrapper,
	},
	data() {
		return {
			image: 'https://images.pexels.com/photos/5006465/pexels-photo-5006465.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260',
			transform: 'horizontal-flip',
		};
	},
	computed: {
		defaultTransforms() {
			if (this.transform === 'horizontal-flip') {
				return {
					flip: {
						horizontal: true,
					},
				};
			} else if (this.transform === 'vertical-flip') {
				return {
					flip: {
						vertical: true,
					},
				};
			} else if (this.transform === 'rotate-90') {
				return {
					rotate: 90,
				};
			} else if (this.transform === 'rotate-180') {
				return {
					rotate: 180,
				};
			}
		},
	},
	methods: {
		loadImage(event) {
			const { files } = event.target;
			if (files && files[0]) {
				if (this.image.src) {
					URL.revokeObjectURL(this.image.src);
				}
				this.image = URL.createObjectURL(files[0]);
			}
		},
	},
	destroyed() {
		// Revoke the object URL, to allow the garbage collector to destroy the uploaded before file
		if (this.image) {
			URL.revokeObjectURL(this.image);
		}
	},
};
</script>

<template>
	<example-wrapper
		:no-border="true"
		class="default-transforms-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/default-transforms-example.vue"
	>
		<div class="default-transforms-example__cropper-wrapper">
			<cropper class="default-transforms-example__cropper" :default-transforms="defaultTransforms" :src="image" />
		</div>
		<div class="panel">
			<div class="panel__left">
				<div class="input">
					<span class="input__label">Default Transforms</span>
					<select v-model="transform" class="input__control" type="text">
						<option value="horizontal-flip">Horizontal Flip</option>
						<option value="vertical-flip">Vertical Flip</option>
						<option value="rotate-90">Rotate 90°</option>
						<option value="rotate-180">Rotate 180°</option>
					</select>
				</div>
			</div>
			<div class="panel__right">
				<button class="button" @click="$refs.file.click()">
					Upload image
					<input ref="file" type="file" accept="image/*" @change="loadImage($event)" />
				</button>
			</div>
		</div>
	</example-wrapper>
</template>

<style lang="scss">
.default-transforms-example {
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

	&__buttons-wrapper {
		display: flex;
		justify-content: center;
		margin-top: 17px;
	}

	.input {
		&__control {
			padding: 8px;
			width: 100%;
			border: none;
			color: black;
			font: inherit;
			font-size: 15px;
		}
		&__label {
			display: block;
			font-size: 11px;
			margin-bottom: 5px;
		}
	}

	.button {
		width: 160px;
		margin-top: 15px;
		display: block;
		color: white;
		font-size: 16px;
		padding: 10px 20px;
		text-align: center;
		background: #1f8255;
		cursor: pointer;
		transition: background 0.5s;
		font-weight: normal;
		border: none;
		&:hover {
			background: #26a069;
			text-decoration: none !important;
		}
		input {
			display: none;
		}
	}
	.panel {
		color: white;
		display: flex;
		align-items: flex-end;
		padding: 20px;
		background: #3fb37f;
		&__left {
			width: 100%;
			padding-right: 30px;
		}
	}
}
</style>
