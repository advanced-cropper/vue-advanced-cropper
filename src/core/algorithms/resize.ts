import { MoveEvent, ResizeEvent } from "../events";
import { AspectRatio, Coordinates, PositionRestrictions, SizeRestrictions } from "../typings";
import { ALL_DIRECTIONS } from "../constants";
import { applyDirections, fitConditions, getBrokenRatio, ratio } from "../service";
import { move } from "./move";

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
