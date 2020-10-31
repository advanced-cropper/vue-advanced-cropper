import { CropperEvent, Diff, MoveDirections, Point, ResizeDirections, Scale } from './typings';

export class ManipulateImageEvent implements CropperEvent {
	type: 'manipulateImage';
	nativeEvent: Event;
	move: Partial<MoveDirections>;
	scale: Partial<Scale>;
	constructor(move: Partial<MoveDirections> = {}, scale: Partial<Scale> = {}) {
		this.type = 'manipulateImage';
		this.move = move;
		this.scale = scale;
	}
}

export interface ResizeEventParams {
	compensate?: boolean;
	preserveRatio?: boolean;
	allowedDirections?: ResizeDirections;
	respectDirection?: 'width' | 'height';
}

export class ResizeEvent implements CropperEvent {
	type: 'resize';
	directions: ResizeDirections;
	params: ResizeEventParams;

	constructor(directions: ResizeDirections, params: ResizeEventParams = {}) {
		this.type = 'resize';
		this.directions = directions;
		this.params = params;
	}
}

export class MoveEvent implements CropperEvent {
	type: 'move';
	directions: MoveDirections;

	constructor(directions: MoveDirections) {
		this.type = 'move';
		this.directions = directions;
	}
}

export class DragEvent implements CropperEvent {
	type: 'drag';
	nativeEvent: Event;
	position: Point;
	previousPosition: Point;
	anchor: Point;
	element: HTMLElement;

	constructor(nativeEvent: Event, element: HTMLElement, position: Point, previousPosition: Point, anchor: Point) {
		this.type = 'drag';
		this.nativeEvent = nativeEvent;
		this.position = position;
		this.previousPosition = previousPosition;
		this.element = element;
		this.anchor = anchor;
	}
	public shift(): Diff {
		const { element, anchor, position } = this;
		const { left, top } = element.getBoundingClientRect();

		return {
			left: position.left - left - anchor.left,
			top: position.top - top - anchor.top,
		};
	}
}
