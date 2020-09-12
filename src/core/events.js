export class ManipulateImageEvent {
	constructor(nativeEvent, move = {}, scale = {}, params = {}) {
		this.type = 'manipulateImage';
		this.nativeEvent = nativeEvent;
		this.move = move;
		this.scale = scale;
		this.params = params;
	}
}

export class ResizeEvent {
	constructor(nativeEvent, directions, params = {}) {
		this.type = 'resize';
		this.nativeEvent = nativeEvent;
		this.directions = directions;
		this.params = params;
	}
}

export class MoveEvent {
	constructor(nativeEvent, directions) {
		this.type = 'move';
		this.nativeEvent = nativeEvent;
		this.directions = directions;
	}
}

export class DragEvent {
	constructor(nativeEvent, element, position, previousPosition, anchor) {
		this.nativeEvent = nativeEvent;
		this.position = position;
		this.previousPosition = previousPosition;
		this.element = element;
		this.anchor = anchor;
	}
	shift() {
		const { element, anchor, position, } = this;
		const { left, top, } = element.getBoundingClientRect();

		return {
			left: position.left - left - anchor.left,
			top: position.top - top - anchor.top,
		};
	}
}
