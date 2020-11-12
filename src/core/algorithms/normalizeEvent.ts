import { ManipulateImageEvent, MoveEvent, ResizeEvent } from '../events';
import { VisibleArea } from '../typings';
import { ALL_DIRECTIONS, MAIN_DIRECTIONS } from '../constants';

interface NormalizeEventParams {
	event: ResizeEvent | MoveEvent | ManipulateImageEvent;
	visibleArea: VisibleArea;
	coefficient: number;
}
export function normalizeEvent({ event, visibleArea, coefficient }: NormalizeEventParams) {
	if (event.type === 'manipulateImage') {
		return {
			...event,
			move: {
				left: event.move && event.move.left ? coefficient * event.move.left : 0,
				top: event.move && event.move.top ? coefficient * event.move.top : 0,
			},
			scale: {
				factor: event.scale && event.scale.factor ? event.scale.factor : 1,
				center:
					event.scale && event.scale.center
						? {
								left: event.scale.center.left * coefficient + visibleArea.left,
								top: event.scale.center.top * coefficient + visibleArea.top,
						  }
						: null,
			},
		};
	} else if (event.type === 'resize') {
		const normalizedEvent = { ...event, directions: { ...event.directions } };
		ALL_DIRECTIONS.forEach((direction) => {
			normalizedEvent.directions[direction] *= coefficient;
		});
		return normalizedEvent;
	} else if (event.type === 'move') {
		const normalizedEvent = { ...event, directions: { ...event.directions } };
		MAIN_DIRECTIONS.forEach((direction) => {
			normalizedEvent.directions[direction] *= coefficient;
		});
		return normalizedEvent;
	} else {
		return event;
	}
}
