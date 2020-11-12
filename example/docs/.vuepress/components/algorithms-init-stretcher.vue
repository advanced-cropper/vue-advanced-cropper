<script>
import { Cropper, BoundingBox } from 'vue-advanced-cropper';
import { initStretcher } from '../../../../src/core/algorithms';
import { resizeBox, boxStyle, elementToCoordinates, emptyBox } from '../service/box.ts';
import AlgorithmWrapper from './Algorithms/AlgorithmWrapper';
import DynamicArea from './Algorithms/DynamicArea';
import StaticCropper from './Algorithms/StaticCropper';
import ElementsLegend from './Algorithms/ElementsLegend';
import Group from './Algorithms/Group';
import RunButton from './Algorithms/RunButton';
import GroupInput from './Algorithms/GroupInput';
import Stretcher from './Algorithms/Stretcher';

export default {
	components: {
		Cropper,
		AlgorithmWrapper,
		BoundingBox,
		DynamicArea,
		StaticCropper,
		RunButton,
		GroupInput,
		Group,
		ElementsLegend,
		Stretcher,
	},
	data() {
		return {
			area: emptyBox(),
			displayStretcher: false,
			image: {
				width: 100,
				height: 100,
			},
		};
	},
	mounted() {
		const { container } = this.$refs;
		if (container) {
			this.area.width = container.clientWidth;
			this.area.height = container.clientHeight;
		}
	},
	computed: {
		areaStyle() {
			return boxStyle(this.area);
		},
	},
	methods: {
		onResizeArea(event) {
			this.area = resizeBox(this.area, event, elementToCoordinates(this.$refs.container));
		},
		runAlgorithm() {
			const { stretcher } = this.$refs;
			if (stretcher) {
				this.displayStretcher = true;
				this.$nextTick(() => {
					console.log(stretcher.$el, { ...this.image });
					initStretcher({
						stretcher: stretcher.$el,
						imageSize: this.image,
					});
				});
			}
		},
	},
};
</script>

<template>
	<algorithm-wrapper class="algorithms-init-stretcher">
		<template v-slot:content>
			<div class="algorithms-init-stretcher__area" ref="container">
				<dynamic-area :style="areaStyle" @resize="onResizeArea">
					<static-cropper class="algorithms-init-stretcher__cropper">
						<stretcher :visible="displayStretcher" ref="stretcher" />
					</static-cropper>
				</dynamic-area>
			</div>
			<run-button @click="runAlgorithm" />
		</template>
		<template v-slot:panel>
			<group label="Image">
				<group-input type="number" label="Width" v-model="image.width" />
				<group-input type="number" label="Height" v-model="image.height" />
			</group>
			<group>
				<elements-legend :stretcher="true" :cropper="true" :area="true" />
			</group>
		</template>
	</algorithm-wrapper>
</template>

<style lang="scss">
.algorithms-init-stretcher {
	&__area {
		width: 100%;
		height: 500px;
		position: relative;
	}
	&__cropper {
		text-align: center;
		position: relative;
		user-select: none;
		max-height: 100%;
		max-width: 100%;
		direction: ltr;
		overflow: hidden;
		margin: 1px;
	}
}
</style>
