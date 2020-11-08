<template>
	<div class="results">
		<div class="results__wrapper" v-if="image">
			<div class="results__coordinates">
				<p class="results__coordinates-title">Results:</p>
				<p class="results__coordinates-value">Width: {{ coordinates.width }}</p>
				<p class="results__coordinates-value">Height: {{ coordinates.height }}</p>
				<p class="results__coordinates-value">Left: {{ coordinates.left }}</p>
				<p class="results__coordinates-value">Top: {{ coordinates.top }}</p>
			</div>
			<div class="results__preview">
				<img :src="image" alt />
			</div>
		</div>
	</div>
</template>

<style lang="scss">
@import '../../styles/grid';

.results {
	&__wrapper {
		display: flex;
		position: absolute;
		right: 15px;
		bottom: 15px;
		border: dashed 1px rgba(white, 0.5);
	}
	&__coordinates {
		background: rgba(black, 0.8);
		padding: 5px;
		font-size: 10px;
		color: white;
		pointer-events: none;
		@media (max-width: $screen-sm) {
			display: none;
		}
	}
	&__coordinates-title {
		font-weight: bold;
	}
	&__coordinates-title,
	&__coordinates-value {
		margin-top: 2px;
		margin-bottom: 2px;
	}
	&__preview {
		width: 107px;
		height: 107px;
		opacity: 0.8;
		pointer-events: none;
		img {
			width: 100%;
			height: 100%;
		}
	}
}
</style>

<script>
export default {
	props: {
		coordinates: {
			type: Object,
			default() {
				return {};
			},
		},
		image: {
			type: String,
		},
	},
};
</script>
