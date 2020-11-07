<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			image:
				'https://images.unsplash.com/photo-1540784945875-cd0b362a2093?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
		};
	},
	methods: {
		reset() {
			this.image = null;
		},
		uploadImage(event) {
			const { canvas } = this.$refs.cropper.getResult();
			if (canvas) {
				const form = new FormData();
				canvas.toBlob((blob) => {
					form.append('file', blob);
					fetch('http://example.com/upload/', {
						method: 'POST',
						body: form,
					});
				}, 'image/jpeg');
			}
		},
	},
};
</script>

<template>
	<div class="upload-to-server-example">
		<div class="cropper-wrapper">
			<cropper ref="cropper" :src="image" />
		</div>
		<div class="button-wrapper">
			<span class="button" @click="uploadImage"> Crop image </span>
		</div>
	</div>
</template>

<style lang="scss">
.upload-to-server-example {
	margin-top: 20px;
	margin-bottom: 20px;

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
		width: 100%;
		text-align: center;
	}

	.button:hover {
		background: #38d890;
	}

	.button input {
		display: none;
	}
}
</style>
