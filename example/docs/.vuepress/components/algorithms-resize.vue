<script>
import { Cropper, BoundingBox } from 'vue-advanced-cropper';
import { ResizeEvent } from '../../../../dist/index.es';
import {
	approximatedSize,
	fillBoundaries,
	fitBoundaries,
	initStretcher,
	refineSizeRestrictions,
	resize,
} from '../../../../src/core/algorithms';
import { applyMove, diff, fitToLimits, getCenter, toLimits } from '../../../../src/core/service';
import { centerResizeBox } from '../service/box';
import { resizeBox, boxStyle, elementToCoordinates, emptyBox } from '../service/box.ts';
import AlgorithmWrapper from './Algorithms/AlgorithmWrapper';
import DynamicCropper from './Algorithms/DynamicCropper';
import GroupCheckbox from './Algorithms/GroupCheckbox';
import StaticCropper from './Algorithms/StaticCropper';
import StaticBoundaries from './Algorithms/StaticBoundaries';
import ElementsLegend from './Algorithms/ElementsLegend';
import Group from './Algorithms/Group';
import RunButton from './Algorithms/RunButton';
import GroupInput from './Algorithms/GroupInput';
import GroupSelect from './Algorithms/GroupSelect';
import Stretcher from './Algorithms/Stretcher';

export default {
	components: {
		GroupCheckbox,
		DynamicCropper,
		Cropper,
		AlgorithmWrapper,
		BoundingBox,
		StaticCropper,
		StaticBoundaries,
		RunButton,
		GroupInput,
		GroupSelect,
		Group,
		ElementsLegend,
		Stretcher,
	},
	data() {
		return {
			cropper: emptyBox(),
			algorithm: 'fit',
			stencil: {
				left: 0,
				top: 0,
				width: 100,
				height: 100,
			},
			stencilResize: {
				left: 0,
				top: 0,
				width: 100,
				height: 100,
			},
			boundaries: {
				left: 0,
				top: 0,
				width: 0,
				height: 0,
			},
			aspectRatio: {
				minimum: null,
				maximum: null,
			},
			realTime: true,
			minWidth: null,
			minHeight: null,
			maxWidth: null,
			maxHeight: null,
			params: {
				allowedDirections: {
					left: true,
					right: true,
					top: true,
					bottom: true,
				},
				respectDirection: null,
				preserveRatio: false,
				compensate: false,
			},
		};
	},
	mounted() {
		const { container } = this.$refs;
		if (container) {
			this.boundaries.width = container.clientWidth * 0.8;
			this.boundaries.height = container.clientHeight * 0.8;
			this.boundaries.left = container.clientWidth / 2 - this.boundaries.width / 2;
			this.boundaries.top = container.clientHeight / 2 - this.boundaries.height / 2;

			this.stencil.left = container.clientWidth / 2 - this.stencil.width / 2;
			this.stencil.top = container.clientHeight / 2 - this.stencil.height / 2;
			this.stencilResize = { ...this.stencil };
		}
		window.addEventListener('resize', this.updateContainer);
		window.addEventListener('orientationchange', this.updateContainer);
	},
	destroyed() {
		window.removeEventListener('resize', this.updateContainer);
		window.removeEventListener('orientationchange', this.updateContainer);
	},
	computed: {
		boundariesStyle() {
			return boxStyle(this.boundaries);
		},
		stencilStyle() {
			return boxStyle(this.stencil, this.boundaries);
		},
		resizeStyle() {
			return boxStyle(this.stencilResize, this.boundaries);
		},
		sizeRestrictions() {
			const sizeRestrictions = {
				minWidth: this.minWidth,
				minHeight: this.minHeight,
			};
			if (this.maxWidth) {
				sizeRestrictions.maxWidth = this.maxWidth;
			}
			if (this.maxHeight) {
				sizeRestrictions.maxHeight = this.maxHeight;
			}
			return refineSizeRestrictions({
				sizeRestrictions,
				positionRestrictions: toLimits(this.boundaries),
				imageSize: this.boundaries,
				boundaries: this.boundaries,
				imageRestriction: 'area',
			});
		},
	},
	methods: {
		updateContainer() {
			const { container } = this.$refs;
			if (container) {
				this.boundaries.width = container.clientWidth * 0.8;
				this.boundaries.height = container.clientHeight * 0.8;
				this.boundaries.left = container.clientWidth / 2 - this.boundaries.width / 2;
				this.boundaries.top = container.clientHeight / 2 - this.boundaries.height / 2;

				this.refineCoordinates();

				this.stencilResize.width = Math.min(this.stencilResize.width, container.clientWidth);
				this.stencilResize.height = Math.min(this.stencilResize.height, container.clientHeight);
				this.stencilResize.left -= Math.max(
					0,
					this.stencilResize.width + this.stencilResize.left - container.clientWidth,
				);
			}
		},
		refineCoordinates() {
			const center = getCenter(this.stencil);
			this.stencil = {
				...this.stencil,
				...approximatedSize({
					width: this.stencil.width,
					height: this.stencil.height,
					sizeRestrictions: this.sizeRestrictions,
					aspectRatio: this.aspectRatio,
				}),
			};
			this.stencil = applyMove(this.stencil, diff(center, getCenter(this.stencil)));
			this.stencil = fitToLimits(this.stencil, toLimits(this.boundaries));
			if (this.realTime) {
				this.runAlgorithm();
			}
		},
		onResizeStencil(event) {
			this.stencilResize = resizeBox(this.stencilResize, event, elementToCoordinates(this.$refs.container));
			if (this.realTime) {
				this.runAlgorithm();
			}
		},
		runAlgorithm() {
			this.stencil = resize({
				coordinates: this.stencil,
				sizeRestrictions: this.sizeRestrictions,
				event: new ResizeEvent(
					{
						top: this.stencil.top - this.stencilResize.top,
						left: this.stencil.left - this.stencilResize.left,
						bottom:
							this.stencilResize.top +
							this.stencilResize.height -
							(this.stencil.top + this.stencil.height),
						right:
							this.stencilResize.left +
							this.stencilResize.width -
							(this.stencil.left + this.stencil.width),
					},
					this.params,
				),
				aspectRatio: this.aspectRatio,
				positionRestrictions: toLimits(this.boundaries),
			});
			this.stencilResize = {
				...this.stencil,
			};
		},
	},
};
</script>

<template>
	<algorithm-wrapper class="algorithms-resize">
		<template v-slot:content>
			<div class="algorithms-resize__area" ref="container">
				<static-boundaries class="algorithms-resize__boundaries" :style="boundariesStyle">
					<static-cropper class="algorithms-resize__stencil" :style="stencilStyle" />
					<dynamic-cropper
						class="algorithms-resize__stencil-resize"
						ref="stencil"
						:style="resizeStyle"
						@resize="onResizeStencil"
					/>
				</static-boundaries>
			</div>
			<run-button @click="runAlgorithm" />
		</template>
		<template v-slot:panel>
			<group>
				<group-checkbox label="Realtime" @change="refineCoordinates" v-model="realTime" />
			</group>

			<group>
				<group-select label="Respect Direction" v-model="params.respectDirection">
					<option value="height">Height</option>
					<option value="width">Width</option>
					<option :value="null">Not Defined</option>
				</group-select>
				<group-checkbox label="Compensate" v-model="params.compensate" />
				<group-checkbox label="Preserve Ratio" v-model="params.preserveRatio" />
			</group>

			<group label="Allowed Directions">
				<group-checkbox label="Left" v-model="params.allowedDirections.left" />
				<group-checkbox label="Right" v-model="params.allowedDirections.right" />
				<group-checkbox label="Top" v-model="params.allowedDirections.top" />
				<group-checkbox label="Bottom" v-model="params.allowedDirections.bottom" />
			</group>
			<group label="Aspect Ratio">
				<group-input type="number" label="Minimum" @blur="refineCoordinates" v-model="aspectRatio.minimum" />
				<group-input type="number" label="Maximum" @blur="refineCoordinates" v-model="aspectRatio.maximum" />
			</group>

			<group label="Size Restrictions">
				<group-input type="number" label="Min Width" @blur="refineCoordinates" v-model="minWidth" />
				<group-input type="number" label="Min Height" @blur="refineCoordinates" v-model="minHeight" />
				<group-input type="number" label="Max Width" @blur="refineCoordinates" v-model="maxWidth" />
				<group-input type="number" label="Max Height" @blur="refineCoordinates" v-model="maxHeight" />
			</group>
			<group>
				<elements-legend :stencil="true" :boundaries="true" />
			</group>
		</template>
	</algorithm-wrapper>
</template>

<style lang="scss">
.algorithms-resize {
	&__area {
		width: 100%;
		min-height: 500px;
		height: 100%;
		position: relative;
		padding: 6px;
	}
	&__stencil-resize {
		position: absolute;
	}
	&__stencil {
		position: absolute;
		border-color: #555;
		border-style: dashed;
	}
	&__boundaries {
		position: absolute;
	}
}
</style>
