<script>
import { CircleStencil, RectangleStencil, Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	props: {
		theme: {
			type: String,
		},
	},
	data() {
		return {
			stencil: RectangleStencil,
		};
	},
	computed: {
		image() {
			if (this.theme === 'noire') {
				return 'https://images.pexels.com/photos/5699092/pexels-photo-5699092.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
			} else if (this.theme === 'bubble') {
				return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1052&q=80';
			} else if (this.theme === 'classic') {
				return 'https://images.unsplash.com/photo-1520927640400-f9e83b1bc43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80';
			} else if (this.theme === 'engineer') {
				return 'https://images.unsplash.com/photo-1517976487492-5750f3195933?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80';
			} else if (this.theme === 'compact') {
				return 'https://images.pexels.com/photos/573238/pexels-photo-573238.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
			} else {
				return 'https://images.unsplash.com/photo-1583149577728-9ab503747013?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80';
			}
		},
	},
	methods: {
		setCircleStencil() {
			this.stencil = CircleStencil;
		},
		setRectangleStencil() {
			this.stencil = RectangleStencil;
		},
	},
};
</script>

<template>
	<div class="theme-example" :class="{ [theme]: true }">
		<cropper :src="image" :stencil-component="stencil" />
		<div class="buttons">
			<div class="button" title="Set Rectangle Stencil" @click="setRectangleStencil()">
				<img :src="require('../assets/icons/rectangle-stencil.svg')" />
			</div>
			<div class="button" title="Set Circle Stencil" @click="setCircleStencil()">
				<img :src="require('../assets/icons/circle-stencil.svg')" />
			</div>
		</div>
		<div class="theme-example__theme">Theme: {{ theme }}</div>
	</div>
</template>

<style lang="scss">
.compact {
	@import '~vue-advanced-cropper/dist/theme.compact.scss';
}

.classic {
	@import '~vue-advanced-cropper/dist/theme.classic.scss';
}

.bubble {
	@import '~vue-advanced-cropper/dist/theme.bubble.scss';
}

.noire {
	.vue-advanced-cropper {
		&__image {
			filter: grayscale(1);
		}
	}
	.vue-rectangle-stencil,
	.vue-circle-stencil {
		&__preview {
			border: dashed white 1px;
		}
	}
	.vue-simple-handler {
		display: block;
		background: none;
		&:before,
		&:after {
			content: '';
			width: 2px;
			height: 20px;
			transform: translate(-50%, -50%);
			position: absolute;
			left: 50%;
			top: 50%;
			background: rgba(white, 1);
			display: none;
		}

		&:after {
			width: 20px;
			height: 2px;
		}

		&--east,
		&--west {
			&:before {
				display: block;
			}
		}
		&--north,
		&--south {
			&:after {
				display: block;
			}
		}

		&--east-north,
		&--east-south,
		&--west-south,
		&--west-north {
			&:after,
			&:before {
				display: block;
			}
		}
	}
}
.engineer {
	.vue-rectangle-stencil,
	.vue-circle-stencil {
		&__preview {
			&:after,
			&:before {
				content: '';
				opacity: 0.3;
				position: absolute;
				pointer-events: none;
				z-index: 1;
			}
			&:after {
				border-left: dashed 1px white;
				border-right: dashed 1px white;
				width: 33%;
				height: 100%;
				transform: translateX(-50%);
				left: 50%;
				top: 0;
			}
			&:before {
				border-top: dashed 1px white;
				border-bottom: dashed 1px white;
				height: 33%;
				width: 100%;
				transform: translateY(-50%);
				top: 50%;
				left: 0;
			}
		}
	}

	.vue-circle-stencil {
		&__preview {
			border: dashed 2px rgba(white, 0.3);
		}
	}

	.vue-simple-handler {
		$length: 22px;
		$border-width: 2px;
		display: block;
		background: none;
		opacity: 0.2;
		position: relative;
		flex-shrink: 0;
		transition: opacity 0.5s;
		height: $length;
		width: $length;

		&--north {
			border-top: solid $border-width white;
			top: $length / 2 - 2px;
		}
		&--south {
			border-bottom: solid 2px white;
			top: -$length / 2 + 2px;
		}
		&--west {
			border-left: solid 2px white;
			left: $length / 2 - 1px;
		}
		&--east {
			border-right: solid 2px white;
			left: -$length / 2 + 1px;
		}
		&--east,
		&--west {
			height: $length;
		}
		&--north,
		&--south {
			width: $length;
		}
		&--east-north,
		&--east-south,
		&--west-south,
		&--west-north {
			display: block;
			height: $length;
			width: $length;
			opacity: 0.7;
		}
		&--hover {
			opacity: 1;
		}
	}
}
.theme-example {
	margin-top: 20px;
	margin-bottom: 20px;
	position: relative;
	user-select: none;
	min-height: 200px;
	border: solid 1px #eee;

	&__theme {
		color: white;
		position: absolute;
		font-size: 10px;
		right: 10px;
		bottom: 10px;
		opacity: 0.5;
	}

	.button {
		background: rgba(black, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
		height: 42px;
		width: 42px;
		margin-bottom: 10px;
		cursor: pointer;
		transition: background 0.5s;
		&:hover {
			background: black;
		}
	}
	.buttons {
		position: absolute;
		left: 10px;
		top: 50%;
		transform: translateY(-50%);
	}
}
</style>
