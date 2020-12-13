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
			image:
				'https://images.pexels.com/photos/1758144/pexels-photo-1758144.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
			restrictionType: 'none',
			result: null,
		};
	},
	methods: {
		onCrop({ canvas }) {
			this.result = canvas.toDataURL();
		},
		showImage() {
			const newTab = window.open();
			newTab.document.body.innerHTML = `<img src="${this.result}"></img>`;
		},
	},
};
</script>

<template>
	<example-wrapper
		class="image-restriction-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/image-restrictions-example.vue"
	>
		<cropper
			class="cropper"
			check-orientation
			default-boundaries="fill"
			backgroundClass="background"
			:src="image"
			:image-restriction="restrictionType"
			@change="onCrop"
		/>
		<div class="panel">
			<div class="panel__left">
				<div class="input">
					<span class="input__label">Image Restriction Type</span>
					<select v-model="restrictionType" class="input__control" type="text">
						<option value="fill-area">fill-area</option>
						<option value="fit-area">fit-area</option>
						<option value="stencil">stencil</option>
						<option value="none">none</option>
					</select>
				</div>
			</div>
			<div class="panel__right">
				<div v-if="this.result" class="button" @click="showImage()">Download</div>
			</div>
		</div>
	</example-wrapper>
</template>

<style lang="scss">
.image-restriction-example {
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
	.image-restriction-cropper {
		width: 100%;
		max-height: 500px;
		border: solid 1px #eee;
	}

	.button {
		width: 120px;
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
		&:hover {
			background: #26a069;
			text-decoration: none !important;
		}
		input {
			display: none;
		}
	}

	.cropper {
		height: 600px;
	}
}
</style>
