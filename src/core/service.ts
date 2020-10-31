import {
	AspectRatio,
	Coordinates,
	Diff,
	Intersections,
	Limits,
	MoveDirections,
	Point,
	ResizeDirections,
	Size,
	SizeRestrictions,
} from './typings';
import { ALL_DIRECTIONS, HORIZONTAL_DIRECTIONS, VERTICAL_DIRECTIONS } from './constants';

export function isEqual(a: any, b: any, properties?: string[]): boolean {
	properties = properties || ['width', 'height', 'left', 'top'];
	return !properties.some((property) => a[property] !== b[property]);
}

export function toLimits(object: Coordinates): Limits {
	return {
		left: object.left,
		top: object.top,
		right: object.left + object.width,
		bottom: object.top + object.height,
	};
}

export function diff(firstObject: Point, secondObject: Point): Diff {
	return {
		left: firstObject.left - secondObject.left,
		top: firstObject.top - secondObject.top,
	};
}

export function getCenter(object: Coordinates): Point {
	return {
		left: object.left + object.width / 2,
		top: object.top + object.height / 2,
	};
}

export function getIntersections(object: Coordinates, limits: Limits): Intersections {
	const intersections: Intersections = {
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
	};
	ALL_DIRECTIONS.forEach((direction) => {
		const areaLimit = limits[direction];
		const objectLimit = toLimits(object)[direction];
		if (areaLimit !== undefined && objectLimit !== undefined) {
			if (direction === 'left' || direction === 'top') {
				intersections[direction] = Math.max(0, areaLimit - objectLimit);
			} else {
				intersections[direction] = Math.max(0, objectLimit - areaLimit);
			}
		} else {
			intersections[direction] = 0;
		}
	});
	return intersections;
}

export function applyDirections(coordinates: Coordinates, directions: ResizeDirections): Coordinates {
	return {
		left: coordinates.left - directions.left,
		top: coordinates.top - directions.top,
		width: coordinates.width + directions.left + directions.right,
		height: coordinates.height + directions.top + directions.bottom,
	};
}

export function inverseMove(directions: MoveDirections): MoveDirections {
	return {
		left: -directions.left,
		top: -directions.top,
	};
}

export function applyMove(object: Coordinates, move: MoveDirections): Coordinates {
	return {
		...object,
		left: object.left + move.left,
		top: object.top + move.top,
	};
}

export function applyScale(object: Coordinates, scaleFactor: number, center?: Point, progress?: number): Coordinates {
	if (center) {
		const currentCenter = getCenter(object);
		return {
			width: object.width * scaleFactor,
			height: object.height * scaleFactor,
			left:
				object.left +
				(object.width * (1 - scaleFactor)) / 2 +
				(center.left - currentCenter.left) * (progress || 1 - scaleFactor),
			top:
				object.top +
				(object.height * (1 - scaleFactor)) / 2 +
				(center.top - currentCenter.top) * (progress || 1 - scaleFactor),
		};
	} else {
		return {
			width: object.width * scaleFactor,
			height: object.height * scaleFactor,
			left: object.left + (object.width * (1 - scaleFactor)) / 2,
			top: object.top + (object.height * (1 - scaleFactor)) / 2,
		};
	}
}

export function ratio(object: Size): number {
	return object.width / object.height;
}

export function maxScale(object: Coordinates, area: Limits): number {
	return Math.min(
		area.right !== undefined && area.left !== undefined ? (area.right - area.left) / object.width : Infinity,
		area.bottom !== undefined && area.top !== undefined ? (area.bottom - area.top) / object.height : Infinity,
	);
}

export function fit(object: Coordinates, limits: Limits): MoveDirections {
	const directions = {
		left: 0,
		top: 0,
	};

	const intersection = getIntersections(object, limits);

	if (intersection.left && intersection.left > 0) {
		directions.left = intersection.left;
	} else if (intersection.right && intersection.right > 0) {
		directions.left = -intersection.right;
	}
	if (intersection.top && intersection.top > 0) {
		directions.top = intersection.top;
	} else if (intersection.bottom && intersection.bottom > 0) {
		directions.top = -intersection.bottom;
	}

	return directions;
}

interface FitConditionsParams {
	directions: ResizeDirections;
	coordinates: Coordinates;
	positionRestrictions: Limits;
	sizeRestrictions: SizeRestrictions;
	preserveRatio?: boolean;
	compensate?: boolean;
}

export function fitConditions({
	directions,
	coordinates,
	positionRestrictions = {},
	sizeRestrictions,
	preserveRatio,
	compensate,
}: FitConditionsParams): ResizeDirections {
	const fixedDirections = { ...directions };

	let currentWidth = applyDirections(coordinates, fixedDirections).width;
	let currentHeight = applyDirections(coordinates, fixedDirections).height;

	// Prevent strange resizes when the width or height of stencil becomes smaller than 0
	if (currentWidth < 0) {
		if (fixedDirections.left < 0 && fixedDirections.right < 0) {
			fixedDirections.left =
				-(coordinates.width - sizeRestrictions.minWidth) / (fixedDirections.left / fixedDirections.right);
			fixedDirections.right =
				-(coordinates.width - sizeRestrictions.minWidth) / (fixedDirections.right / fixedDirections.left);
		} else if (fixedDirections.left < 0) {
			fixedDirections.left = -(coordinates.width - sizeRestrictions.minWidth);
		} else if (fixedDirections.right < 0) {
			fixedDirections.right = -(coordinates.width - sizeRestrictions.minWidth);
		}
	}
	if (currentHeight < 0) {
		if (fixedDirections.top < 0 && fixedDirections.bottom < 0) {
			fixedDirections.top =
				-(coordinates.height - sizeRestrictions.minHeight) / (fixedDirections.top / fixedDirections.bottom);
			fixedDirections.bottom =
				-(coordinates.height - sizeRestrictions.minHeight) / (fixedDirections.bottom / fixedDirections.top);
		} else if (fixedDirections.top < 0) {
			fixedDirections.top = -(coordinates.height - sizeRestrictions.minHeight);
		} else if (fixedDirections.bottom < 0) {
			fixedDirections.bottom = -(coordinates.height - sizeRestrictions.minHeight);
		}
	}

	// Prevent breaking limits
	let breaks = getIntersections(applyDirections(coordinates, fixedDirections), positionRestrictions);

	if (compensate) {
		if (breaks.left && breaks.left > 0 && breaks.right === 0) {
			fixedDirections.right += breaks.left;
			fixedDirections.left -= breaks.left;
		} else if (breaks.right && breaks.right > 0 && breaks.left === 0) {
			fixedDirections.left += breaks.right;
			fixedDirections.right -= breaks.right;
		}

		if (breaks.top && breaks.top > 0 && breaks.bottom === 0) {
			fixedDirections.bottom += breaks.top;
			fixedDirections.top -= breaks.top;
		} else if (breaks.bottom && breaks.bottom > 0 && breaks.top === 0) {
			fixedDirections.top += breaks.bottom;
			fixedDirections.bottom -= breaks.bottom;
		}

		breaks = getIntersections(applyDirections(coordinates, fixedDirections), positionRestrictions);
	}

	const maxResize = {
		width: Infinity,
		height: Infinity,
		left: Infinity,
		right: Infinity,
		top: Infinity,
		bottom: Infinity,
	};

	ALL_DIRECTIONS.forEach((direction) => {
		const intersection = breaks[direction];
		if (intersection && fixedDirections[direction]) {
			maxResize[direction] = Math.max(0, 1 - intersection / fixedDirections[direction]);
		}
	});

	if (preserveRatio) {
		const multiplier = Math.min(...ALL_DIRECTIONS.map((direction) => maxResize[direction]));
		if (multiplier !== Infinity) {
			ALL_DIRECTIONS.forEach((direction) => {
				fixedDirections[direction] *= multiplier;
			});
		}
	} else {
		ALL_DIRECTIONS.forEach((direction) => {
			if (maxResize[direction] !== Infinity) {
				fixedDirections[direction] *= maxResize[direction];
			}
		});
	}

	currentWidth = applyDirections(coordinates, fixedDirections).width;
	currentHeight = applyDirections(coordinates, fixedDirections).height;

	if (fixedDirections.right + fixedDirections.left) {
		if (currentWidth > sizeRestrictions.maxWidth) {
			maxResize.width =
				(sizeRestrictions.maxWidth - coordinates.width) / (fixedDirections.right + fixedDirections.left);
		} else if (currentWidth < sizeRestrictions.minWidth) {
			maxResize.width =
				(sizeRestrictions.minWidth - coordinates.width) / (fixedDirections.right + fixedDirections.left);
		}
	}

	if (fixedDirections.bottom + fixedDirections.top) {
		if (currentHeight > sizeRestrictions.maxHeight) {
			maxResize.height =
				(sizeRestrictions.maxHeight - coordinates.height) / (fixedDirections.bottom + fixedDirections.top);
		} else if (currentHeight < sizeRestrictions.minHeight) {
			maxResize.height =
				(sizeRestrictions.minHeight - coordinates.height) / (fixedDirections.bottom + fixedDirections.top);
		}
	}

	if (preserveRatio) {
		const multiplier = Math.min(maxResize.width, maxResize.height);
		if (multiplier !== Infinity) {
			ALL_DIRECTIONS.forEach((direction) => {
				fixedDirections[direction] *= multiplier;
			});
		}
	} else {
		if (maxResize.width !== Infinity) {
			HORIZONTAL_DIRECTIONS.forEach((direction) => {
				fixedDirections[direction] *= maxResize.width;
			});
		}
		if (maxResize.height !== Infinity) {
			VERTICAL_DIRECTIONS.forEach((direction) => {
				fixedDirections[direction] *= maxResize.height;
			});
		}
	}

	return fixedDirections;
}

export function getBrokenRatio(currentAspectRatio: number, aspectRatio: AspectRatio): number | undefined {
	let ratioBroken;
	if (aspectRatio.minimum && currentAspectRatio < aspectRatio.minimum) {
		ratioBroken = aspectRatio.minimum;
	} else if (aspectRatio.maximum && currentAspectRatio > aspectRatio.maximum) {
		ratioBroken = aspectRatio.maximum;
	}
	return ratioBroken;
}

export function fitSize(firstCoordinates: Size, secondCoordinates: Size): Size {
	const firstRatio = ratio(firstCoordinates);
	const secondRatio = ratio(secondCoordinates);

	if (firstRatio > secondRatio) {
		return {
			width: secondCoordinates.width,
			height: secondCoordinates.width * firstRatio,
		};
	} else {
		return {
			width: secondCoordinates.height * firstRatio,
			height: secondCoordinates.height,
		};
	}
}

export function fitPosition(coordinates: Coordinates, area: Limits) {
	return applyMove(coordinates, fit(coordinates, area));
}
