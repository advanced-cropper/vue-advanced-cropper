import {
	HORIZONTAL_DIRECTIONS,
	VERTICAL_DIRECTIONS,
	ALL_DIRECTIONS,
	MAIN_DIRECTIONS
} from './constants';

import {
	isUndefined
} from './utils';

import { MoveEvent } from './events';

function isEqual(a, b, properties) {
	properties = properties || ['width', 'height', 'left', 'top'];
	return !properties.some(property => a[property] !== b[property]);
}

function diff(firstObject, secondObject) {
	return {
		left: firstObject.left - secondObject.left,
		top: firstObject.top - secondObject.top,
	};
}

function applyDirections(coordinates, directions) {
	return {
		left: coordinates.left - directions.left,
		top: coordinates.top - directions.top,
		width: coordinates.width + directions.left + directions.right,
		height: coordinates.height + directions.top + directions.bottom,
	};
}

function inverseMove(directions) {
	return {
		left: -directions.left,
		top: -directions.top,
	};
}

function applyMove(object, move) {
	return {
		...object,
		left: object.left + move.left,
		top: object.top + move.top,
	};
}

function applyScale(object, scaleFactor, center, progress) {
	if (center) {
		const currentCenter = getCenter(object);
		return {
			width: object.width * scaleFactor,
			height: object.height * scaleFactor,
			left: object.left + object.width * (1 - scaleFactor) / 2 + (center.left - currentCenter.left) * (progress || (1 - scaleFactor)),
			top: object.top + object.height * (1 - scaleFactor) / 2 + (center.top - currentCenter.top) * (progress || (1 - scaleFactor)),
		};
	} else {
		return {
			width: object.width * scaleFactor,
			height: object.height * scaleFactor,
			left: object.left + object.width * (1 - scaleFactor) / 2,
			top: object.top + object.height * (1 - scaleFactor) / 2,
		};
	}
}

function getCenter(object) {
	return {
		left: object.left + object.width / 2,
		top: object.top + object.height / 2,
	};
}

export function ratio(object) {
	return object.width / object.height;
}

export function fitIn(firstObject, secondObject) {
	const firstRatio = ratio(firstObject);
	const secondRatio = ratio(secondObject);

	if (firstRatio > secondRatio) {
		return {
			width: secondObject.width,
			height: secondObject.width * firstRatio
		};
	} else {
		return {
			width: secondObject.height * firstRatio,
			height: secondObject.height
		};
	}
}

export function fit(object, limits) {
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

function toLimits(object) {
	return {
		left: object.left,
		top: object.top,
		right: object.left + object.width,
		bottom: object.top + object.height,
	};
}

function maxScale(object, area) {
	return Math.min(
		area.right !== undefined && area.left !== undefined ? (area.right - area.left) / object.width : Infinity,
		area.bottom !== undefined && area.top !== undefined ? (area.bottom - area.top) / object.height : Infinity,
	);
}

function isEmpty(object) {
	return !object || !object.width || !object.height;
}


function getIntersections(object, limits) {
	const intersections = {
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

function fitConditions({ directions, coordinates, positionRestrictions = {}, sizeRestrictions, preserveRatio, compensate }) {
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

function fitSize(firstCoordinates, secondCoordinates) {
	const firstRatio = ratio(firstCoordinates);
	const secondRatio = ratio(secondCoordinates);

	if (firstRatio > secondRatio) {
		return {
			width: secondCoordinates.width,
			height: secondCoordinates.width / firstRatio,
		};
	} else {
		return {
			width: secondCoordinates.height * firstRatio,
			height: secondCoordinates.height,
		};
	}
}

function getBrokenRatio(currentAspectRatio, aspectRatio) {
	let ratioBroken;
	if (aspectRatio.minimum && currentAspectRatio < aspectRatio.minimum) {
		ratioBroken = aspectRatio.minimum;
	} else if (aspectRatio.maximum && currentAspectRatio > aspectRatio.maximum) {
		ratioBroken = aspectRatio.maximum;
	}
	return ratioBroken;
}

export function resize ({ event, coordinates, aspectRatio, positionRestrictions, sizeRestrictions }) {
	const actualCoordinates = {
		...coordinates,
		right: coordinates.left + coordinates.width,
		bottom: coordinates.top + coordinates.height,
	};

	const eventParams = event.params || {};

	let directions = {
		...event.directions,
	};

	const allowedDirections = eventParams.allowedDirections || {
		left: true,
		right: true,
		bottom: true,
		top: true,
	};

	if (sizeRestrictions.widthFrozen) {
		directions.left = 0;
		directions.right = 0;
	}

	if (sizeRestrictions.heightFrozen) {
		directions.top = 0;
		directions.bottom = 0;
	}

	ALL_DIRECTIONS.forEach((direction) => {
		if (!allowedDirections[direction]) {
			directions[direction] = 0;
		}
	});

	// 1. First step: determine the safe and desired area
	directions = fitConditions({
		coordinates: actualCoordinates,
		directions,
		sizeRestrictions: sizeRestrictions,
		positionRestrictions,
	});

	// 2. Second step: fix desired box to correspondent to aspect ratio
	let currentWidth = applyDirections(actualCoordinates, directions).width;
	let currentHeight = applyDirections(actualCoordinates, directions).height;

	// Checks ratio:
	let ratioBroken = eventParams.preserveRatio
		? ratio(actualCoordinates)
		: getBrokenRatio(currentWidth / currentHeight, aspectRatio);

	if (ratioBroken) {
		let { respectDirection } = eventParams;
		if (!respectDirection) {
			if (actualCoordinates.width >= actualCoordinates.height || ratioBroken === 1) {
				respectDirection = 'width';
			} else {
				respectDirection = 'height';
			}
		}
		if (respectDirection === 'width') {
			const overlapHeight = currentWidth / ratioBroken - actualCoordinates.height;
			if (allowedDirections.top && allowedDirections.bottom) {
				directions.bottom = overlapHeight / 2;
				directions.top = overlapHeight / 2;
			} else if (allowedDirections.bottom) {
				directions.bottom = overlapHeight;
			} else if (allowedDirections.top) {
				directions.top = overlapHeight;
			} else if (allowedDirections.right) {
				directions.right = 0;
			} else if (allowedDirections.left) {
				directions.left = 0;
			}
		} else if (respectDirection === 'height') {
			const overlapWidth = actualCoordinates.width - currentHeight * ratioBroken;
			if (allowedDirections.left && allowedDirections.right) {
				directions.left = -overlapWidth / 2;
				directions.right = -overlapWidth / 2;
			} else if (allowedDirections.left) {
				directions.left = -overlapWidth;
			} else if (allowedDirections.right) {
				directions.right = -overlapWidth;
			} else if (allowedDirections.top) {
				directions.top = 0;
			} else if (allowedDirections.bottom) {
				directions.bottom = 0;
			}
		}
		// 3. Third step: check if desired box with correct aspect ratios break some limits and fit to this conditions
		directions = fitConditions({
			directions,
			coordinates: actualCoordinates,
			sizeRestrictions: sizeRestrictions,
			positionRestrictions,
			preserveRatio: true,
			compensate: eventParams.compensate,
		});
	}

	// 4. Check if ratio broken (temporary):
	currentWidth = applyDirections(actualCoordinates, directions).width;
	currentHeight = applyDirections(actualCoordinates, directions).height;
	ratioBroken = eventParams.preserveRatio
		? ratio(actualCoordinates)
		: getBrokenRatio(currentWidth / currentHeight, aspectRatio);
	if (ratioBroken && Math.abs(ratioBroken - currentWidth / currentHeight) > 1e-3) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(
				`Something went wrong and ratio was broken: ${currentWidth / currentHeight} instead of ${ratioBroken}`,
			);
		}
		ALL_DIRECTIONS.forEach((direction) => {
			if (!allowedDirections[direction]) {
				directions[direction] = 0;
			}
		});
	}

	return move({
		event: new MoveEvent({
			left: -directions.left,
			top: -directions.top,
		}),
		coordinates: {
			width: coordinates.width + directions.right + directions.left,
			height: coordinates.height + directions.top + directions.bottom,
			left: coordinates.left,
			top: coordinates.top,
		},
		positionRestrictions,
	});
}

export function move ({ event, coordinates, positionRestrictions = {}}) {
	const movedCoordinates = applyMove(coordinates, event.directions);

	return applyMove(
		movedCoordinates,
		fit(movedCoordinates, positionRestrictions)
	);
}


// The main point of this feature is calculating the needed position of stencil and parameters of world transforms
// Real coordinates don't changes here
export function autoZoom({
	coordinates: originalCoordinates,
	visibleArea: originalVisibleArea,
	areaRestrictions
}) {
	let visibleArea = { ...originalVisibleArea };
	const coordinates = { ...originalCoordinates };

	const widthIntersections = Math.max(0, coordinates.width - visibleArea.width);
	const heightIntersections = Math.max(0, coordinates.height - visibleArea.height);

	if (widthIntersections > heightIntersections) {
		visibleArea = applyScale(
			visibleArea,
			Math.min(coordinates.width / visibleArea.width, maxScale(visibleArea, areaRestrictions)),
		);
	} else if (heightIntersections > widthIntersections) {
		visibleArea = applyScale(
			visibleArea,
			Math.min(coordinates.height / visibleArea.height, maxScale(visibleArea, areaRestrictions)),
		);
	}

	visibleArea = applyMove(visibleArea, inverseMove(fit(coordinates, toLimits(visibleArea))));

	visibleArea = applyMove(visibleArea, fit(visibleArea, areaRestrictions));

	return {
		visibleArea,
	};
}

export function manipulateImage({
	event,
	coordinates: originalCoordinates,
	visibleArea: originalVisibleArea,
	sizeRestrictions,
	areaRestrictions,
	positionRestrictions,
	settings
}) {

	const { scale, move } = event;

	let visibleArea = { ...originalVisibleArea };
	const coordinates = { ...originalCoordinates };

	let areaScale = 1;
	let stencilScale = 1;
	const allowedScale =
					scale.factor &&
					Math.abs(scale.factor - 1) > 1e-3 &&
					!sizeRestrictions.widthFrozen &&
					!sizeRestrictions.heightFrozen;

	visibleArea = applyMove(visibleArea, {
		left: move.left || 0,
		top: move.top || 0,
	});

	const scaleRestrictions = {
		stencil: {
			minimum: Math.max(
				sizeRestrictions.minWidth ? sizeRestrictions.minWidth / coordinates.width : 0,
				sizeRestrictions.minHeight ? sizeRestrictions.minHeight / coordinates.height : 0,
			),
			maximum: Math.min(
				sizeRestrictions.maxWidth ? sizeRestrictions.maxWidth / coordinates.width : Infinity,
				sizeRestrictions.maxHeight ? sizeRestrictions.maxHeight / coordinates.height : Infinity,
				maxScale(coordinates, positionRestrictions),
			),
		},
		area: {
			maximum: maxScale(visibleArea, areaRestrictions),
		},
	};

	// If there is scaling then begin scale
	if (scale.factor && allowedScale) {
		// Determine scale factor
		if (scale.factor < 1) {
			stencilScale = Math.max(scale.factor, scaleRestrictions.stencil.minimum);
		} else if (scale.factor > 1) {
			stencilScale = Math.min(
				scale.factor,
				Math.min(scaleRestrictions.area.maximum, scaleRestrictions.stencil.maximum),
			);
		}
	}

	if (stencilScale) {
		// Resize stencil with area as much is possible
		visibleArea = applyScale(visibleArea, stencilScale, scale.center);
	}

	const relativeCoordinates = {
		left: originalCoordinates.left - originalVisibleArea.left,
		right:
			originalVisibleArea.width +
			originalVisibleArea.left -
			(originalCoordinates.width + originalCoordinates.left),
		top: originalCoordinates.top - originalVisibleArea.top,
		bottom:
			originalVisibleArea.height +
			originalVisibleArea.top -
			(originalCoordinates.height + originalCoordinates.top),
	};

	// Move the area to fit to area limits:
	visibleArea = applyMove(visibleArea, fit(visibleArea, areaRestrictions));

	// Move the area to fit to coordinates limits:
	visibleArea = applyMove(
		visibleArea,
		fit(visibleArea, {
			left:
				positionRestrictions.left !== undefined
					? positionRestrictions.left - relativeCoordinates.left * stencilScale
					: undefined,
			top:
				positionRestrictions.top !== undefined
					? positionRestrictions.top - relativeCoordinates.top * stencilScale
					: undefined,
			bottom:
				positionRestrictions.bottom !== undefined
					? positionRestrictions.bottom + relativeCoordinates.bottom * stencilScale
					: undefined,
			right:
				positionRestrictions.right !== undefined
					? positionRestrictions.right + relativeCoordinates.right * stencilScale
					: undefined,
		}),
	);

	// Set the same coordinates of stencil inside visible area
	coordinates.width = coordinates.width * stencilScale;
	coordinates.height = coordinates.height * stencilScale;
	coordinates.left = visibleArea.left + relativeCoordinates.left * stencilScale;
	coordinates.top = visibleArea.top + relativeCoordinates.top * stencilScale;

	// Resize only area if stencil can't be resized and stencil resize is disabled
	if (scale.factor && allowedScale && settings.stencil) {
		if (scale.factor > 1) {
			areaScale = Math.min(scaleRestrictions.area.maximum, scale.factor) / stencilScale;
		} else if (scale.factor < 1) {
			areaScale = Math.max(coordinates.height / visibleArea.height, scale.factor) / stencilScale;
		}
		visibleArea = applyScale(
			visibleArea,
			areaScale,
			getCenter(coordinates),
			Math.pow(scale.factor > 1 ? scaleRestrictions.area.maximum : coordinates.height / visibleArea.height, 2),
		);
		visibleArea = applyMove(visibleArea, fit(visibleArea, areaRestrictions));
	}

	return {
		coordinates,
		visibleArea,
	};
}

// This function returns the approximation size to width / height with respect to
// restrictions and aspect ratio
export function approximateSize({ width, height, aspectRatio, sizeRestrictions }) {

	const ratio = {
		minimum: aspectRatio.minimum || 0,
		maximum: aspectRatio.maximum || Infinity,
	};

	const coordinates = {
		width: Math.max(sizeRestrictions.minWidth, Math.min(sizeRestrictions.maxWidth, width)),
		height: Math.max(sizeRestrictions.minHeight, Math.min(sizeRestrictions.maxHeight, height)),
	};

	function distance(a, b) {
		return Math.pow(a.width - b.width,2) + Math.pow(a.height - b.height, 2);
	}

	function isValid(candidate, ignoreMinimum = false) {
		return 	(
			// TODO: check how to solve the problem with similar but not equal values
			candidate.width >= Math.floor(candidate.height * ratio.minimum) &&
			candidate.width <= Math.ceil(candidate.height * ratio.maximum) &&
			candidate.height <= sizeRestrictions.maxHeight &&
			candidate.width <= sizeRestrictions.maxWidth &&
			candidate.width && candidate.height
		) && (ignoreMinimum || (
			candidate.height >= sizeRestrictions.minHeight &&
			candidate.width >= sizeRestrictions.minWidth
		));
	}

	function findBestCandidate(candidates, ignoreMinimum = false) {
		return candidates.reduce((minimum, candidate) => {
			if (isValid(candidate, ignoreMinimum)) {
				return !minimum || distance(candidate, { width, height }) < distance(minimum, { width, height }) ? candidate : minimum;
			} else {
				return minimum;
			}
		}, null);
	}

	const candidates = [];

	[aspectRatio.minimum, aspectRatio.maximum].forEach((ratio) => {
		if (ratio) {
			candidates.push(
				{ width: coordinates.width, height: coordinates.width / ratio },
				{ width: coordinates.height * ratio, height: coordinates.height },
			);
		}
	});

	if (isValid(coordinates)) {
		candidates.push(coordinates);
	}

	const bestCandidate = findBestCandidate(candidates);

	if (bestCandidate) {
		return bestCandidate;
	} else {
		// If there are no candidates that preserves all limitations, choice the best candidate
		// that breaks minimum height or width limitations
		return findBestCandidate(candidates, true);
	}
}

// This function updates visible area with respect to current transformations and fits
// coordinates to the new visible area
export function updateVisibleArea({ current, previous, areaRestrictions, coordinates }) {
	let visibleArea = { ...current };

	if (previous.width && previous.height && !isEqual(current, previous)) {
		// Adapt scale transformations
		if (previous.width > coordinates.width ) {
			visibleArea = applyScale(visibleArea, Math.min(
				previous.height / visibleArea.height,
				maxScale(visibleArea, areaRestrictions)
			));
		} else {
			visibleArea = applyScale(visibleArea, Math.min(
				previous.width / visibleArea.width,
				maxScale(visibleArea, areaRestrictions)
			));
		}

		// Adapt move transformations
		visibleArea = applyMove(visibleArea, diff(
			getCenter(previous),
			getCenter(visibleArea)
		));

		// Prevent the breaking of limits
		visibleArea = applyMove(visibleArea, fit(visibleArea, areaRestrictions));

		const intersections = getIntersections(coordinates, toLimits(visibleArea));

		if (intersections.left + intersections.right + intersections.top + intersections.bottom)  {
			if (intersections.left + intersections.right > intersections.top + intersections.bottom) {
				visibleArea = applyScale(visibleArea, Math.min(
					(visibleArea.width + intersections.left + intersections.right) / visibleArea.width,
					maxScale(visibleArea, areaRestrictions)
				));
			} else {
				visibleArea = applyScale(visibleArea, Math.min(
					(visibleArea.width + intersections.top + intersections.bottom) / visibleArea.height,
					maxScale(visibleArea, areaRestrictions)
				));
			}
		}
	}

	return visibleArea;
}

export function fitCoordinates({ visibleArea, coordinates: previousCoordinates, aspectRatio, sizeRestrictions, positionRestrictions }) {
	let coordinates = { ...previousCoordinates };
	if (coordinates && coordinates.width && coordinates.height) {
		coordinates = {
			...coordinates,
			...approximateSize({
				width: coordinates.width,
				height: coordinates.height,
				aspectRatio,
				sizeRestrictions: {
					maxWidth: visibleArea.width,
					maxHeight: visibleArea.height,
					minHeight: Math.min(visibleArea.height, sizeRestrictions.minHeight),
					minWidth: Math.min(visibleArea.width, sizeRestrictions.minWidth),
				},
			}),
		};

		coordinates = applyMove(coordinates, diff(getCenter(previousCoordinates), getCenter(coordinates)));

		coordinates = applyMove(coordinates, fit(coordinates, positionRestrictions));
	}
	return coordinates;
}

export function defaultVisibleArea({ imageSize, boundaries }) {
	const imageRatio = ratio(imageSize);
	const boundaryRatio = ratio(boundaries);

	const areaProperties = {
		height: imageRatio > boundaryRatio ? imageSize.height : imageSize.width / boundaryRatio,
		width: imageRatio > boundaryRatio ? imageSize.height * boundaryRatio  : imageSize.width,
	};

	return {
		left: imageSize.width / 2 - areaProperties.width / 2,
		top: imageSize.height / 2 - areaProperties.height / 2,
		width: areaProperties.width,
		height: areaProperties.height
	};
}


export function initStretcher({ stretcher, imageSize }) {
	const aspectRatio = ratio(imageSize);

	if (imageSize.height > imageSize.width) {
		stretcher.style.height = `${imageSize.height}px`;
		stretcher.style.width = `${stretcher.clientHeight * aspectRatio}px`;
		if (stretcher.clientWidth / stretcher.clientHeight !== aspectRatio) {
			stretcher.style.height = `${stretcher.clientWidth / aspectRatio}px`;
		}
	} else {
		stretcher.style.width = `${imageSize.width}px`;
		stretcher.style.height = `${stretcher.clientWidth / aspectRatio }px`;
		if (stretcher.clientHeight / stretcher.clientWidth !== aspectRatio) {
			stretcher.style.width = `${stretcher.clientHeight * aspectRatio}px`;
		}
	}
}

export function defaultBoundaries ({ cropper, imageSize }) {
	const areaHeight = cropper.clientHeight;
	const areaWidth = cropper.clientWidth;

	let currentHeight = areaHeight;
	let currentWidth = imageSize.width * areaHeight / imageSize.height;

	if (currentWidth > areaWidth) {
		currentWidth = areaWidth;
		currentHeight = imageSize.height * areaWidth / imageSize.width;
	}

	return {
		width: currentWidth,
		height: currentHeight,
	};
}

export function joinLimits(a, b) {
	const limits = {};
	ALL_DIRECTIONS.forEach(direction => {
		if (!isUndefined(a[direction]) && !isUndefined(b[direction])) {
			if (direction === 'left' || direction === 'top') {
				limits[direction] = Math.max(a[direction], b[direction]);
			} else {
				limits[direction] = Math.min(a[direction], b[direction]);
			}
		} else if (b[direction]) {
			limits[direction] = b[direction];
		} else if (a[direction]) {
			limits[direction] = a[direction];
		}
	});
	return limits;
}

export function limitBy(limits, object) {
	return joinLimits(limits, toLimits(object));
}

export function positionRestrictions({ imageSize, imageRestriction }) {
	let limits = {};


	if (imageRestriction !== 'none') {
		limits = {
			left: 0,
			top: 0,
			right: imageSize.width,
			bottom: imageSize.height
		};
	}

	return limits;
}

export function areaRestrictions({ imageSize, imageRestriction }) {
	let limits = {};

	if (imageRestriction === 'area') {
		limits = {
			left: 0,
			top: 0,
			right: imageSize.width,
			bottom: imageSize.height
		};
	}

	return limits;
}

export function defaultPosition ({ visibleArea, coordinates }) {
	return {
		left: visibleArea.left + visibleArea.width / 2 - coordinates.width / 2,
		top: visibleArea.top + visibleArea.height / 2 - coordinates.height / 2,
	};
}

export function defaultSize ({ visibleArea, aspectRatio, sizeRestrictions }) {
	return approximateSize({
		width: visibleArea.width * 0.8,
		height: visibleArea.height * 0.8,
		aspectRatio,
		sizeRestrictions: {
			...sizeRestrictions,
			maxWidth: Math.min(visibleArea.width, sizeRestrictions.maxWidth),
			maxHeight: Math.min(visibleArea.height, sizeRestrictions.maxHeight),
		}
	});
}

export function percentRestrictions({ imageSize, minWidth, minHeight, maxWidth, maxHeight }) {
	return {
		minWidth: minWidth / 100 * imageSize.width,
		minHeight: minHeight / 100 * imageSize.height,
		maxWidth: maxWidth / 100 * imageSize.width,
		maxHeight: maxHeight / 100 * imageSize.height,
	};
}

export function roundCoordinates({ coordinates, sizeRestrictions, positionRestrictions }) {
	const roundedCoordinates = {
		width: Math.round(coordinates.width),
		height: Math.round(coordinates.height),
		left: Math.round(coordinates.left),
		top: Math.round(coordinates.top),
	};

	if (roundedCoordinates.width > sizeRestrictions.maxWidth) {
		roundedCoordinates.width = Math.floor(coordinates.width);
	} else if (roundedCoordinates.width < sizeRestrictions.minWidth) {
		roundedCoordinates.width = Math.ceil(coordinates.width);
	}
	if (roundedCoordinates.height > sizeRestrictions.maxHeight) {
		roundedCoordinates.height = Math.floor(coordinates.height);
	} else if (roundedCoordinates.height < sizeRestrictions.minHeight) {
		roundedCoordinates.height = Math.ceil(coordinates.height);
	}
	if (roundedCoordinates.left < positionRestrictions.left || roundedCoordinates.left + roundedCoordinates.width > positionRestrictions.right) {
		roundedCoordinates.left = Math.floor(positionRestrictions.left);
	}
	if (roundedCoordinates.top < positionRestrictions.top || roundedCoordinates.top + roundedCoordinates.height > positionRestrictions.bottom) {
		roundedCoordinates.top = Math.floor(positionRestrictions.top);
	}

	return roundedCoordinates;
}

export function normalizeEvent({ event, visibleArea, coefficient }) {
	if (event.type === 'manipulateImage') {
		return {
			...event,
			move: {
				left: event.move && event.move.left ? coefficient * event.move.left : 0,
				top: event.move && event.move.top ? coefficient * event.move.top : 0,
			},
			scale: {
				factor: event.scale && event.scale.factor ? event.scale.factor : 1,
				center: event.scale && event.scale.center
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

export function refineVisibleArea({ visibleArea, boundaries }) {
	const result = { ...visibleArea };
	const boundariesRatio = ratio(boundaries);
	if (result.width / result.height !== boundariesRatio) {
		result.height = result.width / boundariesRatio;
	}
	return result;
}

export function refineSizeRestrictions({ sizeRestrictions, imageSize, visibleArea, positionRestrictions, imageRestriction = 'none' }) {
	const restrictions = {
		...sizeRestrictions,
		minWidth: sizeRestrictions.minWidth !== undefined ? sizeRestrictions.minWidth : 0,
		minHeight: sizeRestrictions.minHeight !== undefined ? sizeRestrictions.minHeight : 0,
		maxWidth: sizeRestrictions.maxWidth !== undefined ? sizeRestrictions.maxWidth : Infinity,
		maxHeight: sizeRestrictions.maxHeight !== undefined ? sizeRestrictions.maxHeight : Infinity,
	};

	// 1. The situation, when stencil can't be positioned in cropper due to positionRestrictions should be avoided
	if (positionRestrictions.left !== undefined && positionRestrictions.right !== undefined) {
		restrictions.maxWidth = Math.min(restrictions.maxWidth, positionRestrictions.right - positionRestrictions.left);
	}
	if (positionRestrictions.bottom !== undefined && positionRestrictions.top !== undefined) {
		restrictions.maxHeight = Math.min(
			restrictions.maxHeight,
			positionRestrictions.bottom - positionRestrictions.top,
		);
	}

	// 2. The situation when stencil larger than maximum visible area or image should be avoided if imageRestriction != 'none':
	if (imageRestriction !== 'none') {
		const areaMaximum = fitSize(visibleArea, imageSize);
		const maxWidth = imageRestriction === 'area' ? areaMaximum.width : imageSize.width;
		const maxHeight = imageRestriction === 'area' ? areaMaximum.height : imageSize.height;
		if (!restrictions.maxWidth || restrictions.maxWidth > maxWidth) {
			restrictions.maxWidth = maxWidth;
		}
		if (!restrictions.maxHeight || restrictions.maxHeight > maxHeight) {
			restrictions.maxHeight = maxHeight;
		}
	}

	if (restrictions.minWidth > restrictions.maxWidth) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(`Warning: maximum width (${restrictions.maxWidth}px) fewer that the minimum width (${restrictions.minWidth}px). Minimum width set equal to the maximum width and width resizing was blocked`);
		}
		restrictions.minWidth = restrictions.maxWidth;
		restrictions.widthFrozen = true;
	}

	if (restrictions.minHeight > restrictions.maxHeight) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(`Warning: maximum height (${restrictions.maxHeight}px) fewer that the minimum height (${restrictions.minHeight}px). Minimum height set equal to the maximum height and height resizing was blocked`);
		}
		restrictions.minHeight = restrictions.maxHeight;
		restrictions.heightFrozen = true;
	}

	// Stencil should not be larger than visible area anyway
	restrictions.minWidth = Math.min(restrictions.minWidth, visibleArea.width);
	restrictions.minHeight = Math.min(restrictions.minHeight, visibleArea.height);

	return restrictions;
}
