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
import { ALL_DIRECTIONS } from './constants';

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
	if (scaleFactor !== 1) {
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
	} else {
		return object;
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

// Move object to correspond limits
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

export function getBrokenRatio(currentAspectRatio: number, aspectRatio: AspectRatio): number | undefined {
	let ratioBroken;
	if (aspectRatio.minimum && currentAspectRatio < aspectRatio.minimum) {
		ratioBroken = aspectRatio.minimum;
	} else if (aspectRatio.maximum && currentAspectRatio > aspectRatio.maximum) {
		ratioBroken = aspectRatio.maximum;
	}
	return ratioBroken;
}

export function fitSize(firstSize: Size, secondSize: Size): Size {
	const firstRatio = ratio(firstSize);
	const secondRatio = ratio(secondSize);

	if (secondSize.width < Infinity && secondSize.height < Infinity) {
		if (firstRatio > secondRatio) {
			return {
				width: secondSize.width,
				height: secondSize.width / firstRatio,
			};
		} else {
			return {
				width: secondSize.height * firstRatio,
				height: secondSize.height,
			};
		}
	} else if (secondSize.width < Infinity) {
		return {
			width: secondSize.width,
			height: secondSize.width / firstRatio,
		};
	} else if (secondSize.height < Infinity) {
		return {
			width: secondSize.height * firstRatio,
			height: secondSize.height,
		};
	} else {
		return firstSize;
	}
}

export function rotateSize(size: Size, angle: number) {
	const radians = (angle * Math.PI) / 180;
	return {
		width: Math.abs(size.width * Math.cos(radians)) + Math.abs(size.height * Math.sin(radians)),
		height: Math.abs(size.width * Math.sin(radians)) + Math.abs(size.height * Math.cos(radians)),
	};
}

export function rotatePoint(point: Point, angle: number) {
	const radians = (angle * Math.PI) / 180;
	return {
		left: point.left * Math.cos(radians) - point.top * Math.sin(radians),
		top: point.left * Math.sin(radians) + point.top * Math.cos(radians),
	};
}

export function adjustSize(coordinates: Coordinates, area: Limits) {
	const intersections = getIntersections(fitToLimits(coordinates, area), area);

	if (intersections.left + intersections.right + intersections.top + intersections.bottom) {
		if (intersections.left + intersections.right > intersections.top + intersections.bottom) {
			return Math.min(
				(coordinates.width + intersections.left + intersections.right) / coordinates.width,
				maxScale(coordinates, area),
			);
		} else {
			return Math.min(
				(coordinates.height + intersections.top + intersections.bottom) / coordinates.height,
				maxScale(coordinates, area),
			);
		}
	}
	return 1;
}

export function fitToLimits(coordinates: Coordinates, area: Limits, inverse = false) {
	const move = fit(coordinates, area);
	return applyMove(coordinates, inverse ? inverseMove(move) : move);
}

export function limitsToSize(area: Limits) {
	return {
		width: area.right !== undefined && area.left !== undefined ? area.right - area.left : Infinity,
		height: area.bottom !== undefined && area.top !== undefined ? area.bottom - area.top : Infinity,
	};
}

export function limitSizeRestrictions(sizeRestrictions: SizeRestrictions, object: Size) {
	return {
		...sizeRestrictions,
		minWidth: Math.min(object.width, sizeRestrictions.minWidth),
		minHeight: Math.min(object.height, sizeRestrictions.minHeight),
		maxWidth: Math.min(object.width, sizeRestrictions.maxWidth),
		maxHeight: Math.min(object.height, sizeRestrictions.maxHeight),
	};
}

export function joinLimits(a: Limits, b: Limits, intersection = true): Limits {
	const limits: Limits = {};
	ALL_DIRECTIONS.forEach((direction) => {
		const firstDirection = a[direction];
		const secondDirection = b[direction];
		if (firstDirection !== undefined && secondDirection !== undefined) {
			if (direction === 'left' || direction === 'top') {
				limits[direction] = intersection
					? Math.max(firstDirection, secondDirection)
					: Math.min(firstDirection, secondDirection);
			} else {
				limits[direction] = intersection
					? Math.min(firstDirection, secondDirection)
					: Math.max(firstDirection, secondDirection);
			}
		} else if (secondDirection !== undefined) {
			limits[direction] = secondDirection;
		} else if (firstDirection !== undefined) {
			limits[direction] = firstDirection;
		}
	});
	return limits;
}

export function unionLimits(a: Limits, b: Limits) {
	return joinLimits(a, b, false);
}

export function intersectionLimits(a: Limits, b: Limits) {
	return joinLimits(a, b, true);
}
