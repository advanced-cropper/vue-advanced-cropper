<script>
import { Cropper, BoundingBox } from 'vue-advanced-cropper';
import { fillBoundaries, fitBoundaries, initStretcher } from '../../../../src/core/algorithms';
import { centerResizeBox } from '../service/box';
import { resizeBox, boxStyle, elementToCoordinates, emptyBox } from '../service/box.ts';
import AlgorithmWrapper from './Algorithms/AlgorithmWrapper';
import DynamicCropper from './Algorithms/DynamicCropper';
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
			boundaries: null,
			algorithm: 'fit',
			image: {
				width: 100,
				height: 100,
			},
		};
	},
	mounted() {
		const { container } = this.$refs;
		if (container) {
			this.cropper.width = container.clientWidth;
			this.cropper.height = container.clientHeight;
		}
	},
	computed: {
		areaStyle() {
			return boxStyle(this.cropper);
		},
		boundariesStyle() {
			if (this.boundaries) {
				return boxStyle({
					...this.boundaries,
					width: this.boundaries.width - 4,
					height: this.boundaries.height - 4,
				});
			} else {
				return {
					display: 'none',
				};
			}
		},
	},
	methods: {
		onResizeArea(event) {
			this.cropper = centerResizeBox(this.cropper, event, elementToCoordinates(this.$refs.container));
			this.boundaries = null;
		},
		runAlgorithm() {
			const { cropper } = this.$refs;
			if (cropper) {
				if (this.algorithm === 'fill') {
					this.boundaries = fillBoundaries({
						cropper: cropper.$el,
						imageSize: this.image,
					});
				} else {
					this.boundaries = fitBoundaries({
						cropper: cropper.$el,
						imageSize: this.image,
					});
				}
			}
		},
	},
};
</script>

<template>
	<algorithm-wrapper class="algorithms-default-boundaries">
		<template v-slot:content>
			<div class="algorithms-default-boundaries__area" ref="container">
				<dynamic-cropper
					class="algorithms-default-boundaries__cropper"
					ref="cropper"
					:style="areaStyle"
					@resize="onResizeArea"
				>
					<static-boundaries
						class="algorithms-default-boundaries__boundaries"
						:style="boundariesStyle"
					></static-boundaries>
				</dynamic-cropper>
			</div>
			<run-button @click="runAlgorithm" />
		</template>
		<template v-slot:panel>
			<group label="Image">
				<group-input type="number" label="Width" v-model="image.width" />
				<group-input type="number" label="Height" v-model="image.height" />
			</group>
			<group>
				<group-select label="Algorithm" v-model="algorithm">
					<option value="fill">Fill Boundaries</option>
					<option value="fit">Fit Boundaries</option>
				</group-select>
			</group>
			<group>
				<elements-legend :cropper="true" :boundaries="true" />
			</group>
		</template>
	</algorithm-wrapper>
</template>

<style lang="scss">
.algorithms-default-boundaries {
	&__area {
		width: 100%;
		height: 500px;
		position: relative;
		padding: 6px;
	}
	&__cropper {
		padding: 2px;
	}
	&__boundaries {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		top: 50%;
	}
}
</style>
