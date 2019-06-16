<script>
import { BoundingBox, } from 'vue-advanced-cropper'

export default {
	name: 'bounding-box-example',
	data() {
		return {
			img: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
		}
	},
	components: {
		BoundingBox
	}
}
</script>

<template>
<div class="bounding-box-example">
  <BoundingBox
	handlerComponent="simple-handler"
	lineComponent="simple-line"
	:linesClassnames="{
		default: 'line'
	}"
	:handlersClassnames="{
		default: 'handler'
	}"
  >
	  <div class="box"></div>
  </BoundingBox>
</div>
</template>

<style lang="scss">
	.bounding-box-example {
		height: 100px;
		width: 100px;
		padding: 20px;
		.line {
			border-color: rgba(#3fb37f, 0.5);
		}
		.handler {
			background: #3fb37f;
		}
	}
</style>
