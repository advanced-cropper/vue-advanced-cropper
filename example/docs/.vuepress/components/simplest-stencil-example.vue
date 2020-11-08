<script>
import { Cropper } from 'vue-advanced-cropper';
import SimplestStencil from './Components/SimplestStencil';

export default {
	components: {
		Cropper,
		SimplestStencil,
	},
	data() {
		return {
			img:
				'https://images.unsplash.com/photo-1571040895662-2daba5bb466f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80',
		};
	},
};
</script>

<template>
	<cropper :src="img" :stencil-component="$options.components.SimplestStencil" />
</template>
