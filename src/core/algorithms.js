import {
	HORIZONTAL_DIRECTIONS,
	VERTICAL_DIRECTIONS,
	ALL_DIRECTIONS,
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

	if (intersection.left > 0) {
		directions.left = intersection.left;
	} else if (intersection.right > 0) {
		directions.left = -intersection.right;
	}
	if (intersection.top > 0) {
		directions.top = intersection.top;
	} else if (intersection.bottom >	 0) {
		directions.top = -intersection.bottom;
	}

	return directions;
}

export function center(object, area) {
	return {
		left: area.width / 2 - object.width / 2,
		right: area.width / 2 + object.width / 2,
		top: area.height / 2 - object.height / 2,
		bottom: area.height / 2 + object.height / 2,
	};
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
		'left' in area && 'right' in area ? (area.right - area.left) / object.width : Infinity,
		'top' in area && 'bottom' in area ? (area.bottom - area.top) / object.height : Infinity
	);
}

function isEmpty(object) {
	return !object || !object.width || !object.height;
}


export function roundCoordinates({ coordinates, restrictions, allowedArea }) {
	const roundedCoordinates = {
		width: Math.round(coordinates.width),
		height: Math.round(coordinates.height),
		left: Math.round(coordinates.left),
		top: Math.round(coordinates.top),
	};

	if (roundedCoordinates.width > restrictions.maxWidth) {
		roundedCoordinates.width = Math.floor(coordinates.width);
	} else if (roundedCoordinates.width < restrictions.minWidth) {
		roundedCoordinates.width = Math.ceil(coordinates.width);
	}
	if (roundedCoordinates.height > restrictions.maxHeight) {
		roundedCoordinates.height = Math.floor(coordinates.height);
	} else if (roundedCoordinates.height < restrictions.minHeight) {
		roundedCoordinates.height = Math.ceil(coordinates.height);
	}
	if (roundedCoordinates.left < allowedArea.left || roundedCoordinates.left + roundedCoordinates.width > allowedArea.right) {
		roundedCoordinates.left = Math.floor(allowedArea.left);
	}
	if (roundedCoordinates.top < allowedArea.top || roundedCoordinates.top + roundedCoordinates.height > allowedArea.bottom) {
		roundedCoordinates.top = Math.floor(allowedArea.top);
	}

	return roundedCoordinates;
}


function getIntersections(object, limits) {
	const intersections = {};
	ALL_DIRECTIONS.forEach(direction => {
		if (!isUndefined(limits[direction])) {
			if (direction === 'left' || direction === 'top') {
				intersections[direction] = Math.max(0, limits[direction] - toLimits(object)[direction]);
			} else {
				intersections[direction] = Math.max(0, toLimits(object)[direction] - limits[direction]);
			}
		}
	});
	return intersections;
}

function fitConditions({ directions,  coordinates, allowedArea = {}, restrictions, preserveRatio, compensate }) {
	const fixedDirections = { ...directions, };

	let currentWidth = applyDirections(coordinates, fixedDirections).width;
	let currentHeight = applyDirections(coordinates, fixedDirections).height;

	// Prevent strange resizes when the width or height of stencil becomes smaller than 0
	if (currentWidth < 0) {
		if (fixedDirections.left < 0 && fixedDirections.right < 0) {
			fixedDirections.left = -(coordinates.width - restrictions.minWidth) / (fixedDirections.left / fixedDirections.right);
			fixedDirections.right = -(coordinates.width - restrictions.minWidth) / (fixedDirections.right / fixedDirections.left);
		} else if (fixedDirections.left < 0) {
			fixedDirections.left = -(coordinates.width - restrictions.minWidth);
		} else if (fixedDirections.right < 0) {
			fixedDirections.right = -(coordinates.width - restrictions.minWidth);
		}
	}
	if (currentHeight < 0) {
		if (fixedDirections.top < 0 && fixedDirections.bottom < 0) {
			fixedDirections.top = -(coordinates.height - restrictions.minHeight) / (fixedDirections.top / fixedDirections.bottom);
			fixedDirections.bottom = -(coordinates.height - restrictions.minHeight) / (fixedDirections.bottom / fixedDirections.top);
		} else if (fixedDirections.top < 0) {
			fixedDirections.top = -(coordinates.height - restrictions.minHeight);
		} else if (fixedDirections.bottom < 0) {
			fixedDirections.bottom = -(coordinates.height - restrictions.minHeight);
		}
	}

	// Prevent breaking limits
	let breaks = getIntersections(applyDirections(coordinates, fixedDirections), allowedArea);

	if (compensate) {
		if (breaks.left > 0 && breaks.right === 0) {
			fixedDirections.right += breaks.left;
			fixedDirections.left -= breaks.left;
		} else if (breaks.right > 0 && breaks.left === 0) {
			fixedDirections.left += breaks.right;
			fixedDirections.right -= breaks.right;
		}

		if (breaks.top > 0 && breaks.bottom === 0) {
			fixedDirections.bottom += breaks.top;
			fixedDirections.top -= breaks.top;
		} else if (breaks.bottom > 0 && breaks.top === 0) {
			fixedDirections.top += breaks.bottom;
			fixedDirections.bottom -= breaks.bottom;
		}

		breaks = getIntersections(applyDirections(coordinates, fixedDirections), allowedArea);
	}

	const maxResize = {
		width: Infinity,
		height: Infinity
	};

	ALL_DIRECTIONS.forEach(direction => {
		if (breaks[direction] && fixedDirections[direction]) {
			maxResize[direction] = Math.max(0, 1 - breaks[direction] / (fixedDirections[direction]));
		} else {
			maxResize[direction] = Infinity;
		}
	});

	if (preserveRatio) {
		const multiplier = Math.min(...ALL_DIRECTIONS.map(direction => maxResize[direction]));
		if (multiplier !== Infinity) {
			ALL_DIRECTIONS.forEach(direction => {
				fixedDirections[direction] *= multiplier;
			});
		}
	} else {
		ALL_DIRECTIONS.forEach(direction => {
			if (maxResize[direction] !== Infinity) {
				fixedDirections[direction] *= maxResize[direction];
			}
		});
	}

	currentWidth = applyDirections(coordinates, fixedDirections).width;
	currentHeight = applyDirections(coordinates, fixedDirections).height;

	if (fixedDirections.right + fixedDirections.left) {
		if (currentWidth > restrictions.maxWidth) {
			maxResize.width = (restrictions.maxWidth - coordinates.width) / (fixedDirections.right + fixedDirections.left);
		} else if (currentWidth < restrictions.minWidth) {
			maxResize.width = (restrictions.minWidth - coordinates.width) / (fixedDirections.right + fixedDirections.left);
		}
	}

	if (fixedDirections.bottom + fixedDirections.top) {
		if (currentHeight > restrictions.maxHeight) {
			maxResize.height = (restrictions.maxHeight - coordinates.height) / (fixedDirections.bottom + fixedDirections.top);
		} else if (currentHeight < restrictions.minHeight) {
			maxResize.height = (restrictions.minHeight - coordinates.height) / (fixedDirections.bottom + fixedDirections.top);
		}
	}

	if (preserveRatio) {
		const multiplier = Math.min(maxResize.width, maxResize.height);
		if (multiplier !== Infinity) {
			ALL_DIRECTIONS.forEach(direction => {
				fixedDirections[direction] *= multiplier;
			});
		}
	}
	else {
		if (maxResize.width !== Infinity) {
			HORIZONTAL_DIRECTIONS.forEach(direction => {
				fixedDirections[direction] *= maxResize.width;
			});
		}
		if (maxResize.height !== Infinity) {
			VERTICAL_DIRECTIONS.forEach(direction => {
				fixedDirections[direction] *= maxResize.height;
			});
		}
	}

	return fixedDirections;
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

export function resize ({ resizeEvent, coordinates, allowedArea, aspectRatio, restrictions }) {
	const actualCoordinates = {
		...coordinates,
		right: coordinates.left + coordinates.width,
		bottom: coordinates.top + coordinates.height,
	};

	const params = resizeEvent.params || {};

	let directions = {
		...resizeEvent.directions,
	};

	const limitedRestrictions = {
		...restrictions,
		minWidth: Math.max(restrictions.minWidth, restrictions.minimum),
		minHeight: Math.max(restrictions.minHeight, restrictions.minimum),
	};

	const allowedDirections = params.allowedDirections || {
		left: true,
		right: true,
		bottom: true,
		top: true,
	};

	ALL_DIRECTIONS.forEach(direction => {
		if (!allowedDirections[direction]) {
			directions[direction] = 0;
		}
	});

	// 1. First step: determine the safe and desired area
	directions = fitConditions({ coordinates: actualCoordinates, directions, restrictions: limitedRestrictions, allowedArea });

	// 2. Second step: fix desired box to correspondent to aspect ratio
	let currentWidth = applyDirections(actualCoordinates, directions).width;
	let currentHeight = applyDirections(actualCoordinates, directions).height;

	// Checks ratio:
	let ratioBroken = params.preserveRatio ? actualCoordinates.width / actualCoordinates.height : getBrokenRatio(currentWidth / currentHeight, aspectRatio);

	if (ratioBroken) {
		let { respectDirection, } = params;
		if (!respectDirection) {
			if (actualCoordinates.width >= actualCoordinates.height || ratioBroken === 1) {
				respectDirection = 'width';
			} else {
				respectDirection = 'height';
			}
		}
		if (respectDirection === 'width') {
			let overlapHeight = currentWidth / ratioBroken - actualCoordinates.height;
			if ((allowedDirections.top && allowedDirections.bottom)) {
				directions.bottom = overlapHeight / 2;
				directions.top = overlapHeight / 2;
			} else if (allowedDirections.bottom) {
				directions.bottom = overlapHeight;
			} else if (allowedDirections.top) {
				directions.top = overlapHeight;
			}  else if (allowedDirections.right) {
				directions.right = 0;
			} else if (allowedDirections.left) {
				directions.left = 0;
			}
		} else if (respectDirection === 'height') {
			let overlapWidth = actualCoordinates.width - currentHeight * ratioBroken;
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
		directions = fitConditions({ directions, restrictions: limitedRestrictions, coordinates: actualCoordinates, allowedArea, preserveRatio: true, compensate: params.compensate });
	}

	// 4. Check if ratio broken (temporary):
	currentWidth = applyDirections(actualCoordinates, directions).width;
	currentHeight = applyDirections(actualCoordinates, directions).height;
	ratioBroken = params.preserveRatio ? actualCoordinates.width / actualCoordinates.height : getBrokenRatio(currentWidth / currentHeight, aspectRatio);
	if (Math.abs(ratioBroken - currentWidth/currentHeight) > 1e-3) {
		console.error(`Something went wrong and ratio was broken: ${currentWidth/currentHeight} instead of ${ratioBroken}`);
		ALL_DIRECTIONS.forEach(direction => {
			if (!allowedDirections[direction]) {
				directions[direction] = 0;
			}
		});
	}

	return move({
		coordinates: {
			width: coordinates.width + directions.right + directions.left,
			height: coordinates.height + directions.top + directions.bottom,
			left: coordinates.left,
			top: coordinates.top,
		},
		allowedArea,
		moveEvent: new MoveEvent({}, {
			left: -directions.left,
			top: -directions.top,
		})
	});
}

export function move ({ moveEvent, coordinates, allowedArea = {}}) {
	const movedCoordinates = applyMove(coordinates, moveEvent.directions);

	return applyMove(
		movedCoordinates,
		fit(movedCoordinates, allowedArea)
	);
}


// The main point of this feature is calculating the needed position of stencil and parameters of world transforms
// Real coordinates don't changes here
export function autoZoom({ coordinates: originalCoordinates, visibleArea: originalVisibleArea, allowedArea, settings }) {
	let visibleArea = { ...originalVisibleArea };
	let coordinates = { ...originalCoordinates };

	const intersections = getIntersections(coordinates, toLimits(visibleArea));

	const widthIntersections =  intersections.left + intersections.right;
	const heightIntersections = intersections.bottom + intersections.top;

	if (widthIntersections > heightIntersections) {
		visibleArea = applyScale(visibleArea, Math.min((widthIntersections + visibleArea.width) / visibleArea.width, maxScale(visibleArea, allowedArea)));
	} else {
		visibleArea = applyScale(visibleArea, Math.min((heightIntersections + visibleArea.height) / visibleArea.height, maxScale(visibleArea, allowedArea)));
	}

	visibleArea = applyMove(visibleArea, inverseMove(
		fit(coordinates, toLimits(visibleArea))
	));

	visibleArea = applyMove(visibleArea, fit(visibleArea, allowedArea));

	return {
		visibleArea
	};
}


export function manipulateImage({ event, coordinates: originalCoordinates, visibleArea: originalVisibleArea, stencilRestrictions, allowedArea, settings }) {
	let { scale, move } = event;

	let visibleArea = { ...originalVisibleArea };
	let coordinates = { ...originalCoordinates };

	let areaScale = 1;
	let stencilScale = 1;
	const allowedScale = !settings.frozenDirections.width && !settings.frozenDirections.height && Math.abs(scale.factor - 1) > 1e-3;

	// Move visible area. Image shift is inverted.
	visibleArea = applyMove(visibleArea, {
		left: -move.left || 0,
		top: -move.top || 0,
	});

	const scaleRestrictions = {
		stencil: {
			minimum: Math.max(
				stencilRestrictions.minWidth ? stencilRestrictions.minWidth / coordinates.width : 0,
				stencilRestrictions.minHeight ? stencilRestrictions.minHeight / coordinates.height : 0
			),
			maximum: Math.min(
				stencilRestrictions.maxWidth ? stencilRestrictions.maxWidth / coordinates.width : Infinity,
				stencilRestrictions.maxHeight ? stencilRestrictions.maxHeight / coordinates.height : Infinity,
			),
		},
		area: {
			maximum: maxScale(visibleArea, allowedArea),
		}
	};

	// If there is scaling then begin scale
	if (allowedScale) {
		// Determine scale factor
		if (scale.factor < 1) {
			stencilScale = Math.max(scale.factor, scaleRestrictions.stencil.minimum);
		} else if (scale.factor > 1) {
			stencilScale = Math.min(scale.factor, Math.min(scaleRestrictions.area.maximum, scaleRestrictions.stencil.maximum));
		}
	}

	if (stencilScale) {
		// Resize stencil with area as much is possible
		visibleArea = applyScale(visibleArea, stencilScale, scale.center);
	}

	const relativeCoordinates = {
		left: originalCoordinates.left - originalVisibleArea.left,
		right: originalVisibleArea.width + originalVisibleArea.left - (originalCoordinates.width + originalCoordinates.left),
		top: originalCoordinates.top - originalVisibleArea.top,
		bottom: originalVisibleArea.height + originalVisibleArea.top - (originalCoordinates.height + originalCoordinates.top)
	};

	// Move the area to fit to boundaries:
	if (settings.imageRestriction === 'area') {
		visibleArea = applyMove(visibleArea, fit(visibleArea, allowedArea));
	} else if (settings.imageRestriction === 'stencil') {
		visibleArea = applyMove(visibleArea, fit(visibleArea, {
			left: allowedArea.left - relativeCoordinates.left * stencilScale,
			top: allowedArea.top - relativeCoordinates.top * stencilScale,
			bottom: allowedArea.bottom + relativeCoordinates.bottom * stencilScale,
			right: allowedArea.right + relativeCoordinates.right * stencilScale,
		}));
	}

	// Set the same coordinates of stencil inside visible area
	coordinates.width = coordinates.width * stencilScale;
	coordinates.height = coordinates.height * stencilScale;
	coordinates.left = visibleArea.left + relativeCoordinates.left * stencilScale;
	coordinates.top = visibleArea.top + relativeCoordinates.top * stencilScale;

	// Resize only area if stencil can't be resized and stencil resize is disabled
	if (allowedScale && settings.stencil) {
		if (scale.factor > 1) {
			areaScale = Math.min(scaleRestrictions.area.maximum, scale.factor) / stencilScale;
		} else if (scale.factor < 1) {
			areaScale = Math.max(coordinates.height / visibleArea.height, scale.factor) / stencilScale;
		}
		visibleArea = applyScale(
			visibleArea, areaScale, getCenter(coordinates),
			Math.pow(scale.factor > 1 ? scaleRestrictions.area.maximum : coordinates.height / visibleArea.height, 2)
		);
		visibleArea = applyMove(visibleArea, fit(visibleArea, allowedArea));
	}

	return {
		coordinates,
		visibleArea
	};
}


// This function returns the approximation size to width / height with respect to
// restrictions and aspect ratio
export function approximatedSize({ width, height, aspectRatio, restrictions }) {

	const ratio = {
		minimum: aspectRatio.minimum || 0,
		maximum: aspectRatio.maximum || Infinity,
	};

	const coordinates = {
		width: Math.max(restrictions.minWidth, Math.min(restrictions.maxWidth, width)),
		height: Math.max(restrictions.minHeight, Math.min(restrictions.maxHeight, height)),
	};

	function distance(a, b) {
		return Math.pow(a.width - b.width,2) + Math.pow(a.height - b.height, 2);
	}

	function isValid(candidate) {
		return 	(
			candidate.width <= restrictions.maxWidth &&
			candidate.width >= restrictions.minWidth &&
			candidate.height <= restrictions.maxHeight &&
			candidate.height >= restrictions.minHeight &&
			candidate.width >= candidate.height * ratio.minimum &&
			candidate.width <= candidate.height * ratio.maximum &&
			candidate.width && candidate.height
		);
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

	return candidates.reduce((minimum, candidate) => {
		if (isValid(candidate)) {
			return !minimum || distance(candidate, { width, height }) < distance(minimum, { width, height }) ? candidate : minimum;
		} else {
			return minimum;
		}
	}, null);
}



// This function updates visible area with respect to current transformations and fits
// coordinates to the new visible area
export function refreshVisibleArea({ current, previous, imageRestriction, allowedArea }) {
	let visibleArea = { ...current };

	if (previous.width && previous.height && !isEqual(current, previous)) {
		// Adapt scale transformations
		visibleArea = applyScale(visibleArea, Math.min(
			previous.width / visibleArea.width,
			maxScale(visibleArea, allowedArea)
		));

		// Adapt move transformations
		visibleArea = applyMove(visibleArea, diff(
			getCenter(previous),
			getCenter(visibleArea)
		));

		// Prevent the breaking limits
		if (imageRestriction === 'area') {
			visibleArea = applyMove(visibleArea, fit(visibleArea, allowedArea));
		}
	}

	return visibleArea;
}

export function fitToVisibleArea({ visibleArea, coordinates: previousCoordinates, stencilRatio, stencilRestrictions, allowedArea }) {
	let coordinates = { ...previousCoordinates };
	if (!isEmpty(coordinates)) {
		coordinates = {
			...coordinates,
			...approximatedSize({
				width: coordinates.width,
				height: coordinates.height,
				aspectRatio: stencilRatio,
				restrictions: {
					maxWidth: visibleArea.width,
					maxHeight: visibleArea.height,
					minHeight: Math.min(visibleArea.height, stencilRestrictions.minHeight),
					minWidth: Math.min(visibleArea.width, stencilRestrictions.minWidth),
				},
			})
		};

		coordinates = applyMove(coordinates, diff(
			getCenter(previousCoordinates), getCenter(coordinates)
		));

		coordinates = applyMove(coordinates, fit(coordinates, toLimits(visibleArea)));
	}
	return coordinates;
}

export function defaultVisibleArea({ imageSize, boundarySize }) {
	const imageRatio = imageSize.width / imageSize.height;
	const boundaryRatio = boundarySize.width / boundarySize.height;

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
	const aspectRatio = imageSize.width / imageSize.height;

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
		width: areaWidth,
		height: areaHeight,
	};
}

export function allowedArea({ breakBoundaries, imageSize, visibleArea, imageRestriction }) {
	let limits = {};

	if (imageRestriction !== 'none') {
		limits = {
			left: 0,
			top: 0,
			right: imageSize.width,
			bottom: imageSize.height
		};
	}

	if (!breakBoundaries) {
		ALL_DIRECTIONS.forEach(direction => {
			if (!isUndefined(limits[direction])) {
				if (direction === 'left' || direction === 'top') {
					limits[direction] = Math.max(limits[direction], toLimits(visibleArea)[direction]);
				} else {
					limits[direction] = Math.min(limits[direction], toLimits(visibleArea)[direction]);
				}
			} else {
				limits[direction] = toLimits(visibleArea)[direction];
			}
		});
	}

	return limits;
}



// eslint-disable-next-line no-unused-vars
export function defaultPosition ({ cropper, image, stencilWidth, stencilHeight, imageWidth, imageHeight,  props }) {
	return {
		left: imageWidth / 2 - stencilWidth / 2,
		top: imageHeight / 2 - stencilHeight / 2,
	};
}

export function defaultSize ({ visibleArea, aspectRatio, restrictions }) {
	return approximatedSize({
		width: visibleArea.width * 0.8,
		height: visibleArea.height * 0.8,
		aspectRatio,
		restrictions: {
			...restrictions,
			maxWidth: Math.min(visibleArea.width, restrictions.maxWidth),
			maxHeight: Math.min(visibleArea.height, restrictions.maxHeight),
		}
	});
}

export function percentRestrictions({ minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight }) {
	return {
		minWidth: minWidth / 100 * imageWidth,
		minHeight: minHeight / 100 * imageHeight,
		maxWidth: maxWidth / 100 * imageWidth,
		maxHeight: maxHeight / 100 * imageHeight,
	};
}
