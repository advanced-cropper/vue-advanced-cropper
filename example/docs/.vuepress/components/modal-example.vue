<script>
import Vue from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

Vue.use(BootstrapVue);

export default {
	components: {
		Cropper,
	},
	data: function () {
		return {
			img:
				'https://images.unsplash.com/photo-1574244931790-ee19df716899?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=666&q=80',
		};
	},
	methods: {
		pixelsRestriction({ minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight }) {
			return {
				minWidth: minWidth,
				minHeight: minHeight,
				maxWidth: maxWidth,
				maxHeight: maxHeight,
			};
		},
	},
};
</script>

<template>
	<div class="bootstrap-modal">
		<button @click="$refs.modal.show()" class="btn btn-primary" type="button">Open</button>

		<b-modal ref="modal" size="lg" :static="true">
			<cropper
				class="cropper"
				ref="cropper"
				:src="img"
				:stencil-props="{
					aspectRatio: 1 / 1,
				}"
				:size-restrictions-algorithm="pixelsRestriction"
			></cropper>
			<button @click="$refs.cropper.refresh()">Refresh</button>
			<button @click="$refs.cropper.reset()">Reset</button>
		</b-modal>
	</div>
</template>

<style lang="scss">
.bootstrap-modal {
	@import '~bootstrap/dist/css/bootstrap.css';
	@import '~bootstrap-vue/dist/bootstrap-vue.css';
}
</style>
