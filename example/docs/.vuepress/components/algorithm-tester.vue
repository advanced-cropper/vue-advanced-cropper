<script>
import { BoundingBox, ResizeEvent } from 'vue-advanced-cropper';
import {resize} from 'advanced-cropper/algorithms'

export default {
	name: 'AlgorithmTester',
	components: {
		BoundingBox,
	},
	data() {
		return {
			coordinates: {
				cropper: {
					width: 100,
					height: 100,
					left: 150,
					top: 150,
				},
				stencil: {
					width: 100,
					height: 100,
					left: 150,
					top: 150,
				},
				current: {
					width: 100,
					height: 100,
					left: 150,
					top: 150,
				},
				area: {
					width: 400,
					height: 400,
					left: 0,
					top: 0,
				},
			},
			stencilProps: `{\n\t"aspectRatio": 10/16\n}`,
		};
	},
	computed: {
		cropperStyle() {
			return {
				width: `${this.coordinates.cropper.width}px`,
				height: `${this.coordinates.cropper.height}px`,
				top: `${this.coordinates.cropper.top}px`,
				left: `${this.coordinates.cropper.left}px`,
			}
		},
		currentStyle() {
			return {
				width: `${this.coordinates.current.width}px`,
				height: `${this.coordinates.current.height}px`,
				top: `${this.coordinates.current.top}px`,
				left: `${this.coordinates.current.left}px`,
			}
		},
		stencilStyle() {
			return {
				width: `${this.coordinates.stencil.width}px`,
				height: `${this.coordinates.stencil.height}px`,
				top: `${this.coordinates.stencil.top}px`,
				left: `${this.coordinates.stencil.left}px`,
			}
		},
		areaStyle() {
			return {
				width: `${this.coordinates.area.width}px`,
				height: `${this.coordinates.area.height}px`,
				top: `${this.coordinates.area.top}px`,
				left: `${this.coordinates.area.left}px`,
			}
		}
	},
	methods: {
		onResizeStencil({directions}) {
			this.coordinates.stencil.left -= directions.left
			this.coordinates.stencil.top -= directions.top
			this.coordinates.stencil.width += directions.right + directions.left
			this.coordinates.stencil.height += directions.top + directions.bottom
		},
		onResizeArea({directions}) {
			this.coordinates.area.left -= directions.left
			this.coordinates.area.top -= directions.top
			this.coordinates.area.width += directions.right + directions.left
			this.coordinates.area.height += directions.top + directions.bottom
		},
		onResizeCurrent({directions}) {
			this.coordinates.current.left -= directions.left
			this.coordinates.current.top -= directions.top
			this.coordinates.current.width += directions.right + directions.left
			this.coordinates.current.height += directions.top + directions.bottom
		},
		onResize(complete) {
			const coordinates = resize({
				coordinates: {...this.coordinates.current},
				restrictions: {
					minWidth: 100,
					minHeight: 100,
					maxWidth: 400,
					maxHeight: 400,
				},
				aspectRatio: {
					minimum: 10/20,
				},
				allowedArea: {
					left: this.coordinates.area.left,
					top: this.coordinates.area.top,
					bottom: this.coordinates.area.top + this.coordinates.area.height,
					right: this.coordinates.area.left + this.coordinates.area.width,
				},
				coefficient: 1,
				resizeEvent: new ResizeEvent({}, {
					left: -(this.coordinates.stencil.left - this.coordinates.current.left),
					top: -(this.coordinates.stencil.top - this.coordinates.current.top),
					bottom: this.coordinates.stencil.top + this.coordinates.stencil.height - (this.coordinates.current.top + this.coordinates.current.height),
					right: this.coordinates.stencil.left + this.coordinates.stencil.width - (this.coordinates.current.left + this.coordinates.current.width),
				}, {
					compensate: true
				}),
				complete
			})
			this.coordinates.current = {...coordinates}

		}
	}
};
</script>

<template>
  <div class="bounding-box-example">
	  	<div class="playground">
			<div class="area-wrapper">
				<div class="area">
					<BoundingBox
						class="area-box"
						handler-component="simple-handler"
						line-component="simple-line"
						:style="areaStyle"
						:lines-classnames="{default: 'line line--area'}"
						:handlers-classnames="{default: 'handler handler--area'}"
						@resize="onResizeArea"
					/>
					<BoundingBox
						class="stencil-box"
						handler-component="simple-handler"
						line-component="simple-line"
						:style="stencilStyle"
						:lines-classnames="{default: 'line line--stencil'}"
						:handlers-classnames="{default: 'handler handler--stencil'}"
						@resize="onResizeStencil"
					/>
					<div
						class="current-box"
						:style="currentStyle"
					/>
				</div>
				<div class="buttons">
					<div class="button" @click="onResize(false)">
						<img :src="require('../assets/icons/resize.svg')"/>
					</div>
					<div class="button button--complete" @click="onResize(true)">
						<img :src="require('../assets/icons/resize.svg')"/>
					</div>
				</div>

			</div>
		</div>
		<div class="options">
			<div class="option">
				Stencil props:
				<textarea class="option__textarea" v-model="stencilProps"/>
			</div>
		</div>
  </div>
</template>

<style lang="scss">
	.bounding-box-example {
		position: relative;
		padding-top: 20px;
		.playground {
			position: relative;
		}
		.buttons {
			position: absolute;
			right: 20px;
			bottom: 20px;
		}
		.button {
			background: rgb(61, 82, 206);
			border-radius: 50%;
			height: 50px;
			width: 50px;
			margin-top: 10px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			&--complete {
				background: #3fb37f;
			}
		}
		.options {
			border-top: solid 1px #EEE;
			padding-top: 20px;
		}
		.option {
			&__textarea {
				display: block;
				height: 150px;
				width: 100%;
			}
		}
		.area-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 50px;
			padding-bottom: 50px;
			overflow: hidden;
		}
		.area {
			width: 400px;
			height: 400px;
			position: relative;
			outline: dashed 1px #EEE;
		}
		.current-box {
			border: solid 1px rgba(255,150,150, 0.8);
		}
		.stencil-box, .area-box, .current-box {
			pointer-events: none;
			position: absolute;
		}
		.line {
			pointer-events: all;
			&--stencil {
				border-color: rgba(#3fb37f, 0.5);
			}
			&--area {
				border-color: rgba(#555, 0.5);
				border-style: dotted;
			}
		}
		.handler {
			pointer-events: all;
			&--stencil {
				background: #3fb37f;
			}
			&--area {
				background: #555;
				opacity: 0.5;
			}
		}
	}
</style>
