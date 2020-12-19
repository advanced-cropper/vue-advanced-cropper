<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			initialMobileCoordinates: null,
			initialDesktopCoordinates: null,
			img:
				'https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
		};
	},
	methods: {
		change({ coordinates, canvas }) {
			console.log({ coordinates, canvas });
		},
		defaultMobileSize({ visibleArea }) {
			return {
				width: visibleArea.width - 60,
				height: visibleArea.height - 60,
			};
		},
		resetMobile() {
			this.$refs.mobile.setCoordinates(this.initialMobileCoordinates);
			if (!this.initialMobileCoordinates) {
				this.initialMobileCoordinates = { ...this.$refs.mobile.coordinates };
			}
		},
		resetDesktop() {
			this.$refs.desktop.setCoordinates(this.initialDesktopCoordinates);
			if (!this.initialDesktopCoordinates) {
				this.initialDesktopCoordinates = { ...this.$refs.desktop.coordinates };
			}
		},
	},
};
</script>

<template>
	<div class="playground compact">
		<div class="mobile-cropper">
			<cropper
				ref="mobile"
				:auto-zoom="true"
				:default-size="defaultMobileSize"
				:transitions="true"
				priority="visibleArea"
				image-restriction="fill-area"
				default-boundaries="fill"
				src="https://images.pexels.com/photos/5699198/pexels-photo-5699198.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
				class="mobile-cropper__cropper"
			/>
			<button @click="resetMobile">Reset</button>
		</div>
		<div class="desktop-cropper">
			<cropper
				ref="desktop"
				:transitions="true"
				priority="visibleArea"
				image-restriction="fill-area"
				default-boundaries="fill"
				src="https://images.pexels.com/photos/262226/pexels-photo-262226.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
				class="desktop-cropper__cropper"
				:stencil-props="{
					minAspectRatio: 3 / 4,
					maxAspectRatio: 16 / 4,
				}"
			/>
			<button @click="resetDesktop">Reset</button>
		</div>
	</div>
</template>

<style lang="scss">
.playground {
	.mobile-cropper {
		&__cropper {
			width: 135px;
			height: 240px;
			margin-bottom: 32px;
		}
	}

	.desktop-cropper {
		&__cropper {
			width: 504px;
			height: 320px;
			margin-bottom: 32px;
			margin-top: 32px;
		}
	}

	background: black;

	.flex {
		display: flex;
	}

	.experiment {
		max-width: 50%;
	}

	.width-50p {
		width: 50%;
	}

	.width-33p {
		width: 33%;
	}
}

.playground {
	.desktop-cropper {
		$length: 16px;
		$border-width: 2px;

		.vue-advanced-cropper {
			&__background {
				background: #05070c;
			}
			&__image {
				opacity: 0.3;
			}
		}

		.vue-circle-stencil,
		.vue-rectangle-stencil {
			&__preview {
				&:after,
				&:before {
					content: '';
					opacity: 0;
					transition: opacity 0.5s;
					position: absolute;
					pointer-events: none;
					z-index: 1;
				}

				&:after {
					border-left: solid 1px white;
					border-right: solid 1px white;
					width: 33%;
					height: 100%;
					transform: translateX(-50%);
					left: 50%;
					top: 0;
				}

				&:before {
					border-top: solid 1px white;
					border-bottom: solid 1px white;
					height: 33%;
					width: 100%;
					transform: translateY(-50%);
					top: 50%;
					left: 0;
				}
			}

			&--dragging {
				.vue-rectangle-stencil__preview,
				.vue-circle-stencil__preview {
					&:after,
					&:before {
						opacity: 0.4;
					}
				}
			}
		}

		.vue-simple-handler {
			display: block;
			opacity: 0.7;
			position: relative;
			flex-shrink: 0;
			transition: opacity 0.5s;
			border: none;
			background: white;
			top: auto;
			left: auto;
			height: 4px;
			width: 4px;

			&--west-north,
			&--east-south,
			&--west-south,
			&--east-north {
				display: block;
				height: $length;
				width: $length;
				background: none;
			}
			&--west-north {
				border-left: solid 2px white;
				border-top: solid 2px white;
				top: $length / 2 - 1px;
				left: $length / 2 - 1px;
			}
			&--east-south {
				border-right: solid 2px white;
				border-bottom: solid 2px white;
				top: -$length / 2 + 1px;
				left: -$length / 2 + 1px;
			}

			&--west-south {
				border-left: solid 2px white;
				border-bottom: solid 2px white;
				top: -$length / 2 + 1px;
				left: $length / 2 - 1px;
			}
			&--east-north {
				border-right: solid 2px white;
				border-top: solid 2px white;
				top: $length / 2 - 1px;
				left: -$length / 2 + 1px;
			}

			&--hover {
				opacity: 1;
			}
		}
	}
}

.playground {
	.mobile-cropper {
		$length: 16px;
		$border-width: 2px;
		.vue-advanced-cropper {
			&__background {
				background: #05070c;
			}

			&__image {
				opacity: 0.3;
			}
		}

		.vue-circle-stencil,
		.vue-rectangle-stencil {
			&__preview {
				&:after,
				&:before {
					content: '';
					opacity: 0;
					transition: opacity 0.25s;
					position: absolute;
					pointer-events: none;
					z-index: 1;
				}

				&:after {
					border-left: solid 1px white;
					border-right: solid 1px white;
					width: 33%;
					height: 100%;
					transform: translateX(-50%);
					left: 50%;
					top: 0;
				}

				&:before {
					border-top: solid 1px white;
					border-bottom: solid 1px white;
					height: 33%;
					width: 100%;
					transform: translateY(-50%);
					top: 50%;
					left: 0;
				}
			}

			&--dragging {
				.vue-rectangle-stencil__preview,
				.vue-circle-stencil__preview {
					&:after,
					&:before {
						opacity: 0.7;
					}
				}
			}
		}

		.vue-simple-line {
			border-color: rgba(white, 0.8);
		}

		.vue-simple-handler-wrapper {
			width: 24px;
			height: 24px;

			&--west-north {
				transform: translate(0, 0);
			}

			&--east-south {
				transform: translate(-100%, -100%);
			}

			&--west-south {
				transform: translate(0, -100%);
			}

			&--east-north {
				transform: translate(-100%, 0);
			}
		}

		.vue-simple-handler {
			display: block;
			position: relative;
			flex-shrink: 0;
			transition: opacity 0.5s;
			border: none;
			background: white;
			top: auto;
			left: auto;
			height: 4px;
			width: 4px;
			opacity: 0;

			&--west-north,
			&--east-south,
			&--west-south,
			&--east-north {
				display: block;
				height: $length;
				width: $length;
				background: none;
				opacity: 0.7;
			}

			&--west-north {
				border-left: solid 2px white;
				border-top: solid 2px white;
			}

			&--east-south {
				border-right: solid 2px white;
				border-bottom: solid 2px white;
			}

			&--west-south {
				border-left: solid 2px white;
				border-bottom: solid 2px white;
			}

			&--east-north {
				border-right: solid 2px white;
				border-top: solid 2px white;
			}

			&--hover {
				opacity: 1;
			}
		}
	}
}
</style>
