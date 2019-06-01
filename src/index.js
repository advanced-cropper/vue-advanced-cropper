import Vue from 'vue'
import Cropper from './Cropper.vue'

import {
	RectangleStencil
} from './components/stencils'

import {
	SimpleHandler
} from './components/handlers'

import {
	SimpleLine
} from './components/lines'

export {
	PreviewImage,
	DraggableArea,
	BoundingBox,
	LineWrapper,
	HandlerWrapper,
	DraggableElement
} from './components/service'

export {
	RectangleStencil
} from './components/stencils'

export {
	SimpleHandler
} from './components/handlers'

export {
	SimpleLine
} from './components/lines'

export { default as Cropper } from './Cropper.vue'

Vue.component('cropper', Cropper)
Vue.component('rectangle-stencil', RectangleStencil)
Vue.component('simple-handler', SimpleHandler)
Vue.component('simple-line', SimpleLine)
