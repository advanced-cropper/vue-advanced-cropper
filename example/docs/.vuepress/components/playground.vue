<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img:
				'https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260',
		};
	},
	methods: {
		change({ coordinates, canvas }) {
			console.log({ coordinates, canvas });
		},
	},
};
</script>

<template>
	<div class="playground">
		<div>
			<Cropper src="http://localhost:8000/adult-beautiful-beauty-413879.jpg" :canvas="false" @change="change" />
		</div>
		<div class="flex">
			<div class="width-50p">
				<Cropper
					src="https://images.pexels.com/photos/247120/pexels-photo-247120.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
				/>
			</div>
			<div class="width-50p">
				<Cropper
					src="https://images.pexels.com/photos/580012/pexels-photo-580012.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
				/>
			</div>
		</div>
		<div class="flex">
			<div class="width-33p">
				<Cropper
					src="https://images.pexels.com/photos/2355156/pexels-photo-2355156.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
				/>
			</div>
			<div class="width-33p">
				<Cropper
					src="https://images.pexels.com/photos/2355153/pexels-photo-2355153.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
				/>
			</div>
			<div class="width-33p">
				<Cropper
					src="https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.playground {
	background: black;
	.flex {
		display: flex;
	}
	.experiment {
		max-width: 50%;
	}
	.width-50p {
		width: 50%;
	}
	.width-33p {
		width: 33%;
	}
}
</style>
