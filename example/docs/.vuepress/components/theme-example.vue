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
			if (this.theme === 'bubble') {
				return require('../assets/pictures/photo-1595435934249-5df7ed86e1c0.jpg');
			} else if (this.theme === 'classic') {
				return require('../assets/pictures/photo-1520927640400-f9e83b1bc43e.jpg');
			} else if (this.theme === 'compact') {
				return require('../assets/pictures/pexels-photo-573238.jpeg');
			} else {
				return require('../assets/pictures/photo-1583149577728-9ab503747013.jpg');
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
