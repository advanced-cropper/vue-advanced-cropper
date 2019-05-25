import Vue from 'vue'
import Cropper from './Cropper.vue'

import {
	CircleStencil,
	RectangleStencil
} from './components/stencils'

import {
	SquareHandler
} from './components/handlers'

import {
	DefaultLine
} from './components/lines'

export {
	PreviewCanvas,
	PreviewImage,
	DraggableArea,
	BoundingBox,
	LineWrapper,
	HandlerWrapper,
	DraggableElement
} from './components/service'

export {
	CircleStencil,
	RectangleStencil
} from './components/stencils'

export {
	SquareHandler
} from './components/handlers'

export {
	DefaultLine
} from './components/lines'

export { default as Cropper } from './Cropper.vue'

Vue.component('cropper', Cropper)
Vue.component('circle-stencil', CircleStencil)
Vue.component('rectangle-stencil', RectangleStencil)
Vue.component('rectangle-handler', SquareHandler)
Vue.component('default-line', DefaultLine)
