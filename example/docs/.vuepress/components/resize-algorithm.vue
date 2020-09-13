<script>
	import { Cropper } from 'advanced-cropper/testing';
	import { BoundingBox, ResizeEvent } from 'vue-advanced-cropper';

	export default {
		components: {
			BoundingBox,
		},
		data() {
			const cropper = new Cropper({
				boundaries: {
					width: 500,
					height: 500,
				},
				aspectRatio: {
					minimum: 10/20,
				},
				render: this.render
			});

			cropper.setImage({
				width: 800,
				height: 1000,
			});

			return {
				cropper,
				stencil: {
					...cropper.coordinates
				},
				aspectRatio: {
					minimum: cropper.aspectRatio.minimum,
					maximum: cropper.aspectRatio.maximum,
				}
			};
		},
		computed: {
			imageRestriction: {
				get() {
					return this.cropper.imageRestriction;
				},
				set(value) {
					this.cropper.imageRestriction = value;
					this.cropper.setImage(this.cropper.imageSize);
				}
			},
			imageWidth: {
				get() {
					return this.cropper.imageSize.width;
				},
				set(value) {
					this.cropper.setImage({
						width: Number(value),
						height: this.cropper.imageSize.height,
					})
				}
			},
			imageHeight: {
				get() {
					return this.cropper.imageSize.height;
				},
				set(value) {
					this.cropper.setImage({
						width: this.cropper.imageSize.width,
						height: Number(value),
					})
				}
			},
			boundariesWidth: {
				get() {
					return this.cropper.boundaries.width;
				},
				set(value) {
					this.cropper.boundaries.width = value;
					this.cropper.setImage(this.cropper.imageSize);
				}
			},
			boundariesHeight: {
				get() {
					return this.cropper.boundaries.height;
				},
				set(value) {
					this.cropper.boundaries.height = value;
					this.cropper.setImage(this.cropper.imageSize);
				}
			},
			minHeight: {
				get() {
					return this.cropper.minHeight;
				},
				set(value) {
					this.cropper.minHeight = value || undefined;
					this.cropper.resetCoordinates();
				}
			},
			maxHeight: {
				get() {
					return this.cropper.maxHeight;
				},
				set(value) {
					this.cropper.maxHeight = value || undefined;
					this.cropper.resetCoordinates();
				}
			},
			minWidth: {
				get() {
					return this.cropper.minWidth;
				},
				set(value) {
					this.cropper.minWidth = value || undefined;
					this.cropper.resetCoordinates();
				}
			},
			maxWidth: {
				get() {
					return this.cropper.maxWidth;
				},
				set(value) {
					this.cropper.maxWidth = value || undefined;
					this.cropper.resetCoordinates();
				}
			},
			minAspectRatio: {
				get() {
					return this.aspectRatio.minimum;
				},
				set(value) {
					this.aspectRatio.minimum = value;
					if (value > 0) {
						this.cropper.aspectRatio.minimum = Number(value);
						this.cropper.resetCoordinates();
					}
				}
			},
			maxAspectRatio: {
				get() {
					return this.aspectRatio.maximum;
				},
				set(value) {
					this.aspectRatio.maximum = value;
					if (value > 0) {
						this.cropper.aspectRatio.maximum = Number(value);
						this.cropper.resetCoordinates();
					}
				}
			},
			coefficient() {
				return this.cropper.visibleArea.width ? this.cropper.visibleArea.width / this.cropper.boundaries.width : 0;
			},
			cropperStyle() {
				return {
					width: `${this.cropper.coordinates.width}px`,
					height: `${this.cropper.coordinates.height}px`,
					top: `${this.cropper.coordinates.top}px`,
					left: `${this.cropper.coordinates.left}px`,
				}
			},
			currentStyle() {
				const {width, height, left, top} = this.cropper.coordinates;
				return {
					width: `${width / this.coefficient}px`,
					height: `${height / this.coefficient}px`,
					top: `${(top - this.cropper.visibleArea.top) / this.coefficient}px`,
					left: `${(left - this.cropper.visibleArea.left) / this.coefficient}px`,
				}
			},
			stencilStyle() {
				const {width, height, left, top} = this.stencil;
				return {
					width: `${width / this.coefficient}px`,
					height: `${height / this.coefficient}px`,
					top: `${(top - this.cropper.visibleArea.top) / this.coefficient}px`,
					left: `${(left - this.cropper.visibleArea.left) / this.coefficient}px`,
				}
			},
			areaStyle() {
				return {
					width: `${this.cropper.boundaries.width}px`,
					height: `${this.cropper.boundaries.height}px`,
					top: `${this.cropper.boundaries.top}px`,
					left: `${this.cropper.boundaries.left}px`,
				}
			},
			imageStyle() {
				return {
					width: `${this.cropper.imageSize.width / this.coefficient}px`,
					height: `${this.cropper.imageSize.height / this.coefficient}px`,
					top: `${-this.cropper.visibleArea.top / this.coefficient}px`,
					left: `${-this.cropper.visibleArea.left / this.coefficient}px`,
				}
			},
			visibleAreaStyle() {
				return {
					width: `${this.cropper.visibleArea.width / this.coefficient}px`,
					height: `${this.cropper.visibleArea.height / this.coefficient}px`,
					top: 0,
					left: 0,
				}
			}
		},
		methods: {
			render({ coordinates, ...other }) {
				this.stencil = {...coordinates}
			},
			updateStencil() {
				if (this.cropper.coordinates) {
					this.stencil = {
						width: this.cropper.coordinates.width / this.coefficient,
						height: this.cropper.coordinates.height / this.coefficient,
						top: (this.cropper.coordinates.top - this.cropper.visibleArea.top) / this.coefficient,
						left: (this.cropper.coordinates.left - this.cropper.visibleArea.left) / this.coefficient
					}
				}
			},
			onResizeCurrent({directions}) {
				this.stencil.left -= directions.left * this.coefficient
				this.stencil.top -= directions.top  * this.coefficient
				this.stencil.width += (directions.right + directions.left)  * this.coefficient
				this.stencil.height += (directions.top + directions.bottom)  * this.coefficient
			},
			onResize() {
				console.log(this.cropper);
				this.cropper.resize(new ResizeEvent({
					left: (this.cropper.coordinates.left - this.stencil.left),
					top: (this.cropper.coordinates.top - this.stencil.top),
					bottom: (this.stencil.top + this.stencil.height) - this.cropper.coordinates.top - this.cropper.coordinates.height,
					right: (this.stencil.left + this.stencil.width) - this.cropper.coordinates.left - this.cropper.coordinates.width,
				}, {
					compensate: true
				}));
				this.stencil = {
					...this.cropper.coordinates
				}
			}
		},
	};
</script>

<template>
	<div class="bounding-box-example">
		<div class="playground">
			<div class="area-wrapper">
				<div class="area" :style="areaStyle">
					<div class="visible-area" :style="visibleAreaStyle"></div>
					<div class="image-box"></div>
					<BoundingBox
						class="image-box"
						handler-component="simple-handler"
						line-component="simple-line"
						:style="imageStyle"
						:lines-classes="{default: 'line line--image'}"
						:handlers-classes="{default: 'handler handler--image'}"
					/>
					<BoundingBox
						class="stencil-box"
						handler-component="simple-handler"
						line-component="simple-line"
						:style="stencilStyle"
						:lines-classes="{default: 'line line--stencil'}"
						:handlers-classes="{default: 'handler handler--stencil'}"
						@resize="onResizeCurrent"
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
				</div>
			</div>
			<div class="options">
				<div class="option">
					<div class="option__title">
						Image Size
					</div>
					<div class="option__input">
						<input v-model="imageWidth" placeholder="Width"/>
						<input v-model="imageHeight" placeholder="Height"/>
					</div>
				</div>
				<div class="option">
					<div class="option__title">
						Boundaries
					</div>
					<div class="option__input">
						<input v-model="boundariesWidth" placeholder="Width"/>
						<input v-model="boundariesHeight" placeholder="Height"/>
					</div>
				</div>
				<div class="option">
					<div class="option__title">
						Aspect Ratio
					</div>
					<div class="option__input">
						<input v-model="minAspectRatio" placeholder="Minimum"/>
						<input v-model="maxAspectRatio" placeholder="Maximum"/>
					</div>
				</div>
				<div class="option">
					<div class="option__title">
						Height Limitations
					</div>
					<div class="option__input">
						<input v-model="minHeight" placeholder="Minimum"/>
						<input v-model="maxHeight" placeholder="Maximum"/>
					</div>
				</div>
				<div class="option">
					<div class="option__title">
						Width Limitations
					</div>
					<div class="option__input">
						<input v-model="minWidth" placeholder="Minimum"/>
						<input v-model="maxWidth" placeholder="Maximum"/>
					</div>
				</div>
				<div class="option">
					<div class="option__title">
						Image Restriction
					</div>
					<div class="option__input">
						<select v-model="imageRestriction">
							<option value="none">None</option>
							<option value="stencil">Stencil</option>
							<option value="area">Area</option>
						</select>
					</div>
				</div>
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
			border: solid 1px #EEE;
			padding: 20px;
			font-family: "Open Sans", sans-serif;
			margin-top: 16px;
		}
		.option {
			border: solid 1px #EEE;
			padding: 16px;
			margin-top: 8px;

			&__textarea {
				display: block;
				height: 150px;
				width: 100%;
			}
			&__title {
				font-weight: bold;
				font-size: 13px;
				margin-bottom: 6px;
			}
		}
		.area-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			padding-top: 50px;
			padding-bottom: 50px;
			overflow: hidden;
			border: solid 1px #EEE;
			position: relative;
		}
		.area {
			position: relative;
			outline: dashed 1px #EEE;
		}
		.current-box {
			border: solid 1px rgba(255,150,150, 0.8);
		}
		.stencil-box, .area-box, .current-box, .visible-area {
			pointer-events: none;
			position: absolute;
		}
		.visible-area {
			background: rgba(197, 212, 226, 0.1);
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
			&--image {
				border-color: #7C7C7C;
				border-style: dashed;
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
			&--image {
				background: #7C7C7C;
			}
		}
	}
</style>
