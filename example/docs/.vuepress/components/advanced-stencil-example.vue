<script>
import CircleStencil from './Home/Examples/CircleExample/CircleStencil';
import ExampleWrapper from './Components/ExampleWrapper';
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		ExampleWrapper,
		Cropper,
	},
	data() {
		return {
			img:
				require('../assets/pictures/pexels-photo-1451124.jpeg'),
			stencil: CircleStencil,
		};
	},
};
</script>

<template>
	<example-wrapper href="https://codesandbox.io/s/vue-advanced-cropper-custom-stencil-omseq?file=/src/Stencil.vue">
		<cropper :src="img" :stencil-component="stencil" />
	</example-wrapper>
</template>
