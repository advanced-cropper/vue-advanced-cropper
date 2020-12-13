<script>
import { Cropper, BoundingBox } from 'vue-advanced-cropper';
import SimplestStencil from './Components/SimplestStencil';
import ExampleWrapper from './Components/ExampleWrapper';

export default {
	components: {
		ExampleWrapper,
		BoundingBox,
		Cropper,
		SimplestStencil,
	},
	data() {
		return {
			img:
				'https://images.unsplash.com/photo-1553301208-a3718cc0150e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80',
			width: 0,
			height: 0,
			left: 0,
			top: 0,
		};
	},
	methods: {
		updateCoordinates(width, height) {
			const { container } = this.$refs;
			if (container) {
				this.width = Math.min(Math.max(0, width), container.clientWidth);
				this.height = Math.min(Math.max(0, height), container.clientHeight);
				this.left = container.clientWidth / 2 - this.width / 2;
				this.top = container.clientHeight / 2 - this.height / 2;
				this.$refs.cropper.refresh();
			}
		},
		refresh() {
			this.updateCoordinates(this.width, this.height);
		},
		onResize(event) {
			const { container } = this.$refs;
			if (container) {
				const directions = { ...event.directions };

				if (directions.left) {
					directions.right = directions.left;
				}
				if (directions.right) {
					directions.left = directions.right;
				}
				if (directions.top) {
					directions.bottom = directions.top;
				}
				if (directions.bottom) {
					directions.top = directions.bottom;
				}

				const width = this.width + directions.left + directions.right;
				const height = this.height + directions.top + directions.bottom;

				this.updateCoordinates(width, height);
			}
		},
	},
	mounted() {
		const { container } = this.$refs;
		if (container) {
			this.updateCoordinates(container.clientWidth, container.clientHeight, 0, 0);
		}
		window.addEventListener('resize', this.refresh);
		window.addEventListener('orientationchange', this.refresh);
	},
	destroyed() {
		window.removeEventListener('resize', this.refresh);
		window.removeEventListener('orientationchange', this.refresh);
	},
	computed: {
		boxStyle() {
			return {
				width: `${this.width}px`,
				height: `${this.height}px`,
				left: `${this.left}px`,
				top: `${this.top}px`,
			};
		},
	},
};
</script>

<template>
	<example-wrapper
		class="refresh-example"
		href="https://github.com/Norserium/vue-advanced-cropper/blob/master/example/docs/.vuepress/components/refresh-example.vue"
	>
		<div class="container" ref="container">
			<bounding-box
				@resize="onResize"
				:style="boxStyle"
				class="box"
				:lines-classes="{
					default: 'line',
				}"
				:handlers-classes="{
					default: 'handler',
				}"
			>
				<cropper
					class="cropper"
					ref="cropper"
					:src="img"
					:stencil-props="{
						aspectRatio: 1,
					}"
					:min-width="200"
					:min-height="300"
					image-restriction="fill-area"
				/>
			</bounding-box>
		</div>
	</example-wrapper>
</template>

<style lang="scss">
.refresh-example {
	.container {
		width: 100%;
		height: 400px;
		position: relative;
	}
	.cropper {
		width: 100%;
		height: 100%;
	}
	.box {
		position: absolute;
	}
	.line {
		border-color: rgba(#3fb37f, 0.5);
	}
	.handler {
		background: #3fb37f;
	}
}
</style>
