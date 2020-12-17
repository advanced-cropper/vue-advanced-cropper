import Cropper from './Cropper.vue';

import { BoundingBox } from './components/service';
import { SimpleHandler } from './components/handlers';
import { SimpleLine } from './components/lines';
import { RectangleStencil, CircleStencil } from './components/stencils';

export {
	PreviewResult,
	DraggableArea,
	BoundingBox,
	LineWrapper,
	HandlerWrapper,
	DraggableElement,
	StencilPreview,
	TransformableImage,
	BackgroundWrapper,
} from './components/service';

export { RectangleStencil, CircleStencil } from './components/stencils';

export { SimpleHandler } from './components/handlers';

export { SimpleLine } from './components/lines';

export { Preview } from './components/helpers';

export { ResizeEvent, MoveEvent, DragEvent } from './core/events';

export { default as Cropper } from './Cropper.vue';

const inBrowser = typeof window !== 'undefined';

if (inBrowser && window.Vue) {
	window.Vue.use({
		install(Vue) {
			Vue.component('cropper', Cropper);
			Vue.component('rectangle-stencil', RectangleStencil);
			Vue.component('bounding-box', BoundingBox);
			Vue.component('circle-stencil', CircleStencil);
			Vue.component('simple-handler', SimpleHandler);
			Vue.component('simple-line', SimpleLine);
		},
	});
}
