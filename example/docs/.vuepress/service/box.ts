import { ResizeEvent } from '../../../../src/core/events';
import { Coordinates, Size } from '../../../../src/core/typings';

export function resizeBox(box: Coordinates, event: ResizeEvent, area?: Coordinates) {
	const directions = { ...event.directions };

	if (box.width + directions.right < 0) {
		directions.right = -box.width;
	}
	if (box.width + directions.left < 0) {
		directions.left = -box.width;
	}
	if (box.height + directions.bottom < 0) {
		directions.bottom = -box.height;
	}
	if (box.height + directions.top < 0) {
		directions.top = -box.height;
	}

	if (area) {
		if (box.width + box.left + directions.right > area.width + area.left) {
			directions.right = area.width + area.left - box.width - box.left;
		}
		if (box.height + box.top + directions.bottom > area.height + area.top) {
			directions.bottom = area.height + area.top - box.height - box.top;
		}
		if (box.left - directions.left < area.left) {
			directions.left = box.left - area.left;
		}
		if (box.top - directions.top < area.top) {
			directions.top = box.top - area.top;
		}
	}

	const width = box.width + directions.left + directions.right;
	const height = box.height + directions.top + directions.bottom;

	const left = box.left - directions.left;
	const top = box.top - directions.top;

	return {
		width,
		height,
		left,
		top,
	};
}

export function centerResizeBox(box: Coordinates, event: ResizeEvent, area: Coordinates) {
	const directions = { ...event.directions };

	if (directions.left) {
		directions.right = directions.left;
	}
	if (directions.right) {
		directions.left = directions.right;
	}
	if (directions.top) {
		directions.bottom = directions.top;
	}
	if (directions.bottom) {
		directions.top = directions.bottom;
	}

	let width = Math.min(area.width, Math.max(0, box.width + directions.left + directions.right));
	let height = Math.min(area.height, Math.max(0, box.height + directions.top + directions.bottom));

	const left = area.width / 2 - width / 2;
	const top = area.height / 2 - height / 2;

	return {
		width,
		height,
		left,
		top,
	};
}

export function elementToCoordinates(element: HTMLElement | null) {
	if (element) {
		return {
			left: 0,
			top: 0,
			width: element.clientWidth,
			height: element.clientHeight,
		};
	}
}

export function boxStyle(coordinates: Coordinates, area?: Coordinates) {
	if (!area) {
		return {
			width: `${coordinates.width}px`,
			height: `${coordinates.height}px`,
			left: `${coordinates.left}px`,
			top: `${coordinates.top}px`,
		};
	} else {
		return {
			width: `${coordinates.width}px`,
			height: `${coordinates.height}px`,
			left: `${coordinates.left - area.left}px`,
			top: `${coordinates.top - area.top}px`,
		};
	}

}

export function emptyBox() {
	return {
		width: 0,
		height: 0,
		left: 0,
		top: 0,
	};
}
