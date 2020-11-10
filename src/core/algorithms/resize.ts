import { MoveEvent, ResizeEvent } from '../events';
import { AspectRatio, Coordinates, Limits, PositionRestrictions, ResizeDirections, SizeRestrictions } from '../typings';
import { ALL_DIRECTIONS, HORIZONTAL_DIRECTIONS, VERTICAL_DIRECTIONS } from '../constants';
import { applyDirections, getBrokenRatio, getIntersections, ratio } from '../service';
import { move } from './move';

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

export interface ResizeParams {
	event: ResizeEvent;
	coordinates: Coordinates;
	aspectRatio: AspectRatio;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
}

export function resize(params: ResizeParams): Coordinates {
	const { event, coordinates, aspectRatio, positionRestrictions, sizeRestrictions } = params;
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
