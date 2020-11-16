<template>
	<div class="legend">
		<div class="legend__element" v-for="element in types" v-if="$props[element.name]">
			<div class="legend__square" :class="`legend__square--${element.name}`"></div>
			<div class="legend__label" :class="`legend__label--${element.name}`">
				{{ element.text || element.name }}
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import '../../styles/constants';
.legend {
	&__element {
		display: flex;
		align-items: center;
		&:not(:last-child) {
			margin-bottom: 10px;
		}
	}
	&__square {
		height: 6px;
		width: 6px;
		margin-right: 10px;
		&--area {
			background: $area-color;
		}
		&--stretcher {
			background: $stretcher-color;
		}
		&--boundaries {
			background: $boundaries-color;
		}
		&--cropper {
			background: $cropper-color;
		}
		&--stencil {
			background: $cropper-color;
		}
	}
	&__label {
		font-size: 10px;
		&--area {
			color: $area-color;
		}
		&--stretcher {
			color: $stretcher-color;
		}
		&--boundaries {
			color: $boundaries-color;
		}
		&--cropper {
			color: $cropper-color;
		}
		&--stencil {
			color: $cropper-color;
		}
	}
}
</style>

<script>
const types = [
	{
		name: 'area',
		text: 'Area',
	},
	{
		name: 'stencil',
		text: 'Stencil',
	},
	{
		name: 'cropper',
		text: 'Cropper',
	},
	{
		name: 'stretcher',
		text: 'Stretcher',
	},
	{
		name: 'visibleArea',
		text: 'Visible area',
	},
	{
		name: 'boundaries',
		text: 'Boundaries',
	},
];

export default {
	props: types.map((el) => el.name),
	data() {
		return {
			types: [...types],
		};
	},
};
</script>
