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
				require('../assets/pictures/photo-1571040895662-2daba5bb466f.jpg'),
		};
	},
};
</script>

<template>
	<cropper :src="img" :stencil-component="$options.components.SimplestStencil" />
</template>
