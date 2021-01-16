import Vue from 'vue';
import Cropper from './Cropper.vue';

import { RectangleStencil, CircleStencil } from './components/stencils';

import { SimpleHandler } from './components/handlers';

import { SimpleLine } from './components/lines';

export {
	PreviewResult,
	DraggableArea,
	BoundingBox,
	LineWrapper,
	HandlerWrapper,
	DraggableElement,
	StencilPreview,
} from './components/service';

export { RectangleStencil, CircleStencil } from './components/stencils';

export { SimpleHandler } from './components/handlers';

export { SimpleLine } from './components/lines';

export { Preview } from './components/helpers';

export { ResizeEvent, MoveEvent, DragEvent } from './core/events';

export { default as Cropper } from './Cropper.vue';

Vue.component('cropper', Cropper);
Vue.component('rectangle-stencil', RectangleStencil);
Vue.component('circle-stencil', CircleStencil);
Vue.component('simple-handler', SimpleHandler);
Vue.component('simple-line', SimpleLine);
