import {
	HORIZONTAL_DIRECTIONS,
	VERTICAL_DIRECTIONS,
	ALL_DIRECTIONS
} from './constants';


function getCurrentWidth(actualCoordinates, directions, coefficient) {
	return actualCoordinates.width + coefficient * (directions.left + directions.right);
}

function getCurrentHeight(actualCoordinates, directions, coefficient) {
	return actualCoordinates.height + coefficient * (directions.top + directions.bottom);
}

function fitConditions(oldDirections, coordinates, restrictions, coefficient, imageSize, ratioBroken) {

	const { minHeight, minWidth, maxHeight, maxWidth, } = restrictions;
	const directions = { ...oldDirections, };

	const currentWidth = getCurrentWidth(coordinates, directions, coefficient);
	const currentHeight = getCurrentHeight(coordinates, directions, coefficient);

	if (currentWidth < 0) {
		if (directions.left < 0 && directions.right < 0) {
			directions.left = -(coordinates.width - minWidth) / (directions.left / directions.right);
			directions.right = -(coordinates.width - minWidth) / (directions.right / directions.left);
		} else if (directions.left < 0) {
			directions.left = -(coordinates.width - minWidth) / coefficient;
		} else if (directions.right < 0) {
			directions.right = -(coordinates.width - minWidth) / coefficient;
		}
	}

	if (currentHeight < 0) {
		if (directions.top < 0 && directions.bottom < 0) {
			directions.top = -(coordinates.height - minHeight) / (directions.top / directions.bottom);
			directions.bottom = -(coordinates.height - minHeight) / (directions.bottom / directions.top);
		} else if (directions.top < 0) {
			directions.top = -(coordinates.height - minHeight);
		} else if (directions.bottom < 0) {
			directions.bottom = -(coordinates.height - minHeight);
		}
	}

	const maxMultiplier = {
		width: Infinity,
		height: Infinity,
	};

	if (directions.right + directions.left) {
		// Break right border
		if (Math.ceil(coordinates.left + coordinates.width + coefficient * directions.right) > imageSize.width) {
			maxMultiplier.width = Math.min(
				maxMultiplier.width,
				Math.abs(Math.floor(imageSize.width - (coordinates.left + coordinates.width)) / (coefficient * directions.right))
			);
		}
		// Break left border
		if (coordinates.left - coefficient * directions.left < 0) {
			maxMultiplier.width = Math.min(
				maxMultiplier.width,
				Math.abs((coordinates.left) / (coefficient * directions.left))
			);
		}

		// Break min width
		if (currentWidth < minWidth) {
			maxMultiplier.width = Math.min(
				maxMultiplier.width,
				Math.abs((coordinates.width - minWidth) / ((directions.right + directions.left) * coefficient))
			);
		}
		// Break max width
		if (currentWidth > maxWidth) {
			maxMultiplier.width = Math.min(
				maxMultiplier.width,
				Math.abs((maxWidth - coordinates.width) / ((directions.right + directions.left) * coefficient))
			);
		}
	}

	if (directions.top + directions.bottom) {
		// Break bottom border
		if (Math.ceil(coordinates.top + coordinates.height + coefficient * directions.bottom) > imageSize.height) {
			maxMultiplier.height = Math.min(
				maxMultiplier.height,
				Math.abs(Math.floor(imageSize.height - (coordinates.top + coordinates.height)) / (coefficient * directions.bottom))
			);
		}
		// Break top border
		if (coordinates.top - coefficient * directions.top < 0) {
			maxMultiplier.height = Math.min(
				maxMultiplier.height,
				Math.abs((coordinates.top) / (coefficient * directions.top))
			);
		}
		// Break min height
		if (currentHeight < minHeight) {
			maxMultiplier.height = Math.min(
				maxMultiplier.height,
				Math.abs((coordinates.height - minHeight) / ((directions.top + directions.bottom) * coefficient))
			);
		}
		// Break max height
		if (currentHeight > maxHeight) {
			maxMultiplier.height = Math.min(
				maxMultiplier.height,
				Math.abs((maxHeight - coordinates.height) / ((directions.top + directions.bottom) * coefficient))
			);
		}
	}

	// If ratio is not broken, resize all directions independently
	if (!ratioBroken) {
		if (maxMultiplier.width !== Infinity) {
			HORIZONTAL_DIRECTIONS.forEach(direction => {
				directions[direction] *= maxMultiplier.width;
			});
		}
		if (maxMultiplier.height !== Infinity) {
			VERTICAL_DIRECTIONS.forEach(direction => {
				directions[direction] *= maxMultiplier.height;
			});
		}
	// If ratio is broken, resize all directions same time to preserve restored aspect ratio
	} else {
		let multiplier;
		if (maxMultiplier.height < maxMultiplier.width) {
			multiplier = maxMultiplier.height;
		} else if (directions.right + directions.left) {
			multiplier = maxMultiplier.width;
		}

		if (maxMultiplier.height !== Infinity || maxMultiplier.width !== Infinity) {
			ALL_DIRECTIONS.forEach(direction => {
				directions[direction] *= multiplier;
			});
		}
	}

	return directions;
}

export function resize (coordinates, restrictions, imageSize, coefficient, aspectRatio, resizeEvent) {
	const actualCoordinates = {
		...coordinates,
		right: coordinates.left + coordinates.width,
		bottom: coordinates.top + coordinates.height,
	};

	const params = resizeEvent.params || {};

	let directions = {
		...resizeEvent.directions,
	};

	const allowedDirections = params.allowedDirections || {
		left: true,
		right: true,
		bottom: true,
		top: true,
	};

	Object.keys(allowedDirections).forEach(direction => {
		if (!allowedDirections[direction]) {
			directions[direction] = 0;
		}
	});

	let currentWidth = getCurrentWidth(actualCoordinates, directions, coefficient);
	let currentHeight = getCurrentHeight(actualCoordinates, directions, coefficient);

	// 1. First step: fit desired box to existing limits to prevent unpredictable behaviour during aspect ratio fixing
	directions = fitConditions(directions, actualCoordinates, restrictions, coefficient, imageSize);

	// 2. Second step: fix desired box to correspondent to aspect ratio
	currentWidth = getCurrentWidth(actualCoordinates, directions, coefficient);
	currentHeight = getCurrentHeight(actualCoordinates, directions, coefficient);

	// Checks ratio:
	let ratioBroken = null;
	if (params.preserveAspectRatio) {
		ratioBroken = actualCoordinates.width / actualCoordinates.height;
	} else if (aspectRatio.minimum && currentWidth / currentHeight < aspectRatio.minimum) {
		ratioBroken = aspectRatio.minimum;
	} else if (aspectRatio.maximum && currentWidth / currentHeight > aspectRatio.maximum) {
		ratioBroken = aspectRatio.maximum;
	}

	if (ratioBroken) {
		let { respectDirection, } = params;
		if (!respectDirection) {
			if (actualCoordinates.width > actualCoordinates.height) {
				respectDirection = 'width';
			} else {
				respectDirection = 'height';
			}
		}
		if (respectDirection === 'width') {
			let overlapHeight = actualCoordinates.height - currentWidth / ratioBroken;
			if (allowedDirections.top && allowedDirections.bottom) {
				directions.bottom = -overlapHeight / (2 * coefficient);
				directions.top = -overlapHeight / (2 * coefficient);
			} else if (allowedDirections.top) {
				directions.top = -overlapHeight / coefficient;
			} else if (allowedDirections.bottom) {
				directions.bottom = -overlapHeight / coefficient;
			} else if (allowedDirections.right) {
				directions.right = 0;
			} else if (allowedDirections.left) {
				directions.left = 0;
			}
		} else if (respectDirection === 'height') {
			let overlapWidth = actualCoordinates.width - currentHeight * ratioBroken;
			if (allowedDirections.left && allowedDirections.right) {
				directions.left = -overlapWidth / (2 * coefficient);
				directions.right = -overlapWidth / (2 * coefficient);
			} else if (allowedDirections.left) {
				directions.left = -overlapWidth / coefficient;
			} else if (allowedDirections.right) {
				directions.right = -overlapWidth / coefficient;
			} else if (allowedDirections.top) {
				directions.top = 0;
			} else if (allowedDirections.bottom) {
				directions.bottom = 0;
			}
		} else {
			ALL_DIRECTIONS.forEach(direction => {
				directions[direction] *= 0;
			});
		}
	}

	// 3. Third step: check if desired box with correct aspect ratios break some limits and fit to this conditions
	directions = fitConditions(directions, actualCoordinates, restrictions, coefficient, imageSize, ratioBroken);
	return {
		width: coordinates.width + coefficient * (Math.round(directions.right) + Math.round(directions.left)),
		height: coordinates.height + coefficient * (Math.round(directions.top) + Math.round(directions.bottom)),
		left: coordinates.left - coefficient * Math.round(directions.left),
		top: coordinates.top - coefficient * Math.round(directions.top),
	};
}

export function move (coordinates, imageSize, coefficient, moveEvent) {
	const directions = {
		...moveEvent.directions,
	};

	const newCoordinates = {
		left: coordinates.left + coefficient * directions.left,
		top: coordinates.top + coefficient * directions.top,
		width: coordinates.width,
		height: coordinates.height,
	};

	if (newCoordinates.left < 0) {
		newCoordinates.left = 0;
	}
	if (newCoordinates.left + newCoordinates.width > imageSize.width) {
		newCoordinates.left = Math.max(0, imageSize.width - newCoordinates.width);
	}
	if (newCoordinates.top < 0) {
		newCoordinates.top = 0;
	}
	if (newCoordinates.top + newCoordinates.height > imageSize.height) {
		newCoordinates.top = Math.max(0, imageSize.height - newCoordinates.height);
	}

	return newCoordinates;
}

export function areaSize (cropper, image, imageWidth, imageHeight) {
	const areaHeight = cropper.clientHeight;
	const areaWidth = cropper.clientWidth;

	let currentHeight = areaHeight;
	let currentWidth = imageWidth * areaHeight / imageHeight;

	if (currentWidth > areaWidth) {
		currentWidth = areaWidth;
		currentHeight = imageHeight * areaWidth / imageWidth;
	}

	return {
		width: currentWidth,
		height: currentHeight,
	};
}

// eslint-disable-next-line no-unused-vars
export function defaultPosition (cropper, image, stencilWidth, stencilHeight, imageWidth, imageHeight,  props) {
	return {
		left: imageWidth / 2 - stencilWidth / 2,
		top: imageHeight / 2 - stencilHeight / 2,
	};
}

// eslint-disable-next-line no-unused-vars
export function defaultSize (cropper, image, restrictions, imageWidth, imageHeight, props) {
	const { maxWidth, maxHeight, minWidth, minHeight, } = restrictions;

	let newHeight, newWidth;
	if (maxHeight > maxWidth) {
		newHeight = Math.max(minHeight, maxHeight * 0.8);
		newWidth = Math.max(minWidth, maxWidth * 0.8);
	} else {
		newWidth = Math.max(minWidth, maxWidth * 0.8);
		newHeight = Math.max(minHeight, maxHeight * 0.8);
	}

	return {
		height: newHeight,
		width: newWidth,
	};
}

export function percentRestrictions(minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight) {
	return {
		minWidth: minWidth / 100 * imageWidth,
		minHeight: minHeight / 100 * imageHeight,
		maxWidth: maxWidth ? maxWidth / 100 * imageWidth : imageWidth,
		maxHeight: maxHeight ? maxHeight / 100 * imageHeight : imageHeight,
	};
}
