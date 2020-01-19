import {
	HORIZONTAL_DIRECTIONS,
	VERTICAL_DIRECTIONS,
	ALL_DIRECTIONS,
} from './constants';

import {
	isUndefined
} from './utils';

import { MoveEvent } from './events';

function allSides(coordinates) {
	return {
		left: coordinates.left,
		top: coordinates.top,
		right: coordinates.left + coordinates.width,
		bottom: coordinates.top + coordinates.height,
	};
}

function mainSide(side) {
	if (side === 'right') {
		return 'left';
	} else if (side === 'bottom') {
		return 'top';
	} else if (side === 'left' || side === 'top') {
		return side;
	}
}

function getCurrentWidth(actualCoordinates, directions) {
	return actualCoordinates.width + (directions.left + directions.right);
}

function getCurrentHeight(actualCoordinates, directions) {
	return actualCoordinates.height + (directions.top + directions.bottom);
}

function getBrokenLimits(coordinates, directions, allowedArea) {
	return {
		left: ('left' in allowedArea) ? -Math.min(0, Math.ceil(coordinates.left - allowedArea.left) - directions.left) : 0,
		top: ('top' in allowedArea) ? -Math.min(0, Math.ceil(coordinates.top - allowedArea.top) - directions.top) : 0,
		bottom: ('bottom' in allowedArea) ? -Math.min(0, allowedArea.bottom - (coordinates.bottom + directions.bottom)) : 0,
		right: ('right' in allowedArea) ? -Math.min(0, allowedArea.right - (coordinates.right + directions.right)) : 0,
	};
}

function fitConditions({ directions: oldDirections, coordinates, restrictions, preserveAspectRatio, stopOnBreak, mode = 'crop', allowedArea = {}}) {
	const directions = { ...oldDirections, };

	let currentWidth = getCurrentWidth(coordinates, directions);
	let currentHeight = getCurrentHeight(coordinates, directions);

	// Prevent strange resizes when the width or height of stencil becomes smaller than 0
	if (currentWidth < 0) {
		if (directions.left < 0 && directions.right < 0) {
			directions.left = -(coordinates.width - restrictions.minWidth) / (directions.left / directions.right);
			directions.right = -(coordinates.width - restrictions.minWidth) / (directions.right / directions.left);
		} else if (directions.left < 0) {
			directions.left = -(coordinates.width - restrictions.minWidth);
		} else if (directions.right < 0) {
			directions.right = -(coordinates.width - restrictions.minWidth);
		}
	}
	if (currentHeight < 0) {
		if (directions.top < 0 && directions.bottom < 0) {
			directions.top = -(coordinates.height - restrictions.minHeight) / (directions.top / directions.bottom);
			directions.bottom = -(coordinates.height - restrictions.minHeight) / (directions.bottom / directions.top);
		} else if (directions.top < 0) {
			directions.top = -(coordinates.height - restrictions.minHeight);
		} else if (directions.bottom < 0) {
			directions.bottom = -(coordinates.height - restrictions.minHeight);
		}
	}

	// Prevent breaking limits
	let breaks = getBrokenLimits(coordinates, directions, allowedArea);

	if (mode === 'move') {
		if (breaks.left > 0 && breaks.right === 0) {
			directions.right += breaks.left;
			directions.left -= breaks.left;
		} else if (breaks.right > 0 && breaks.left === 0) {
			directions.left += breaks.right;
			directions.right -= breaks.right;
		}

		if (breaks.top > 0 && breaks.bottom === 0) {
			directions.bottom += breaks.top;
			directions.top -= breaks.top;
		} else if (breaks.bottom > 0 && breaks.top === 0) {
			directions.top += breaks.bottom;
			directions.bottom -= breaks.bottom;
		}

		breaks = getBrokenLimits(coordinates, directions, allowedArea);
	}

	const maxResize = {
		width: Infinity,
		height: Infinity
	};

	ALL_DIRECTIONS.forEach(direction => {
		if (breaks[direction] && directions[direction]) {
			maxResize[direction] = Math.max(0, 1 - breaks[direction] / (directions[direction]));
		} else {
			maxResize[direction] = Infinity;
		}
	});

	if (preserveAspectRatio) {
		const multiplier = Math.min(...ALL_DIRECTIONS.map(direction => maxResize[direction]));
		if (multiplier !== Infinity) {
			ALL_DIRECTIONS.forEach(direction => {
				directions[direction] *= multiplier;
			});
		}
	} else {
		HORIZONTAL_DIRECTIONS.forEach(direction => {
			const multiplier = stopOnBreak ? Math.min(maxResize.top, maxResize.bottom) : maxResize[direction];
			if (multiplier !== Infinity) {
				directions[direction] *= multiplier;
			}
		});
		VERTICAL_DIRECTIONS.forEach(direction => {
			const multiplier = stopOnBreak ? Math.min(maxResize.top, maxResize.bottom) : maxResize[direction];
			if (multiplier !== Infinity) {
				directions[direction] *= multiplier;
			}
		});
	}

	currentWidth = getCurrentWidth(coordinates, directions);
	currentHeight = getCurrentHeight(coordinates, directions);

	if (directions.right + directions.left) {
		if (currentWidth > restrictions.maxWidth) {
			maxResize.width = (restrictions.maxWidth - coordinates.width) / (directions.right + directions.left);
		} else if (currentWidth < restrictions.minWidth) {
			maxResize.width = (restrictions.minWidth - coordinates.width) / (directions.right + directions.left);
		}
	}

	if (directions.bottom + directions.top) {
		if (currentHeight > restrictions.maxHeight) {
			maxResize.height = (restrictions.maxHeight - coordinates.height) / (directions.bottom + directions.top);
		} else if (currentHeight < restrictions.minHeight) {
			maxResize.height = (restrictions.minHeight - coordinates.height) / (directions.bottom + directions.top);
		}
	}

	if (preserveAspectRatio) {
		const multiplier = Math.min(maxResize.width, maxResize.height);
		if (multiplier !== Infinity) {
			ALL_DIRECTIONS.forEach(direction => {
				directions[direction] *= multiplier;
			});
		}
	}
	else {
		if (maxResize.width !== Infinity) {
			HORIZONTAL_DIRECTIONS.forEach(direction => {
				directions[direction] *= maxResize.width;
			});
		}
		if (maxResize.height !== Infinity) {
			VERTICAL_DIRECTIONS.forEach(direction => {
				directions[direction] *= maxResize.height;
			});
		}
	}

	return directions;
}



function getBrokenRatio(currentWidth, currentHeight, aspectRatio, actualCoordinates, preserveAspectRatio) {
	let ratioBroken;
	if (aspectRatio.minimum && currentWidth / currentHeight < aspectRatio.minimum) {
		ratioBroken = aspectRatio.minimum;
	} else if (aspectRatio.maximum && currentWidth / currentHeight > aspectRatio.maximum) {
		ratioBroken = aspectRatio.maximum;
	} else if (preserveAspectRatio) {
		ratioBroken = actualCoordinates.width / actualCoordinates.height;
	}
	return ratioBroken;
}

export function resize ({ coordinates, restrictions, allowedArea, aspectRatio, resizeEvent }) {
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

	ALL_DIRECTIONS.forEach(direction => {
		if (!allowedDirections[direction]) {
			directions[direction] = 0;
		}
	});

	// 1. First step: determine the safe and desired area
	directions = fitConditions({ directions, restrictions, coordinates: actualCoordinates, allowedArea, stopOnBreak: params.stopOnBreak });

	// 2. Second step: fix desired box to correspondent to aspect ratio
	let currentWidth = getCurrentWidth(actualCoordinates, directions);
	let currentHeight = getCurrentHeight(actualCoordinates, directions);

	// Checks ratio:
	let ratioBroken = getBrokenRatio(currentWidth, currentHeight, aspectRatio, actualCoordinates, params.preserveAspectRatio);

	if (ratioBroken) {
		let { respectDirection, } = params;
		if (!respectDirection) {
			if (actualCoordinates.width >= actualCoordinates.height || ratioBroken == 1) {
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
		directions = fitConditions({ directions, restrictions, coordinates: actualCoordinates, allowedArea, preserveAspectRatio: true, mode: params.compensate && !params.stopOnBreak ? 'move' : 'crop' });
	}

	// 4. Check if ratio broken (temporary):
	currentWidth = getCurrentWidth(actualCoordinates, directions);
	currentHeight = getCurrentHeight(actualCoordinates, directions);
	ratioBroken = getBrokenRatio(currentWidth, currentHeight, aspectRatio, actualCoordinates, params.preserveAspectRatio);
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

export function move ({ coordinates, allowedArea = {}, moveEvent }) {

	const directions = {
		...moveEvent.directions,
	};

	const newCoordinates = {
		left: coordinates.left + directions.left,
		top: coordinates.top + directions.top,
		width: coordinates.width,
		height: coordinates.height,
	};

	if ('left' in allowedArea && newCoordinates.left < allowedArea.left) {
		newCoordinates.left = allowedArea.left;
	}
	if ('right' in allowedArea && newCoordinates.left + newCoordinates.width > allowedArea.right) {
		newCoordinates.left = allowedArea.right - newCoordinates.width;
	}
	if ('top' in allowedArea && newCoordinates.top < allowedArea.top) {
		newCoordinates.top = allowedArea.top;
	}
	if ('bottom' in allowedArea && newCoordinates.top + newCoordinates.height > allowedArea.bottom) {
		newCoordinates.top = allowedArea.bottom - newCoordinates.height;
	}

	return newCoordinates;
}

// eslint-disable-next-line no-unused-vars
export function areaSize ({ cropper, image, imageWidth, imageHeight }) {
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
export function defaultPosition ({ cropper, image, stencilWidth, stencilHeight, imageWidth, imageHeight,  props }) {
	return {
		left: imageWidth / 2 - stencilWidth / 2,
		top: imageHeight / 2 - stencilHeight / 2,
	};
}

// eslint-disable-next-line no-unused-vars
export function defaultSize ({ cropper, image, minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight, aspectRatio, props }) {
	let newHeight, newWidth;
	let areaWidth = imageWidth;
	let areaHeight = imageHeight;

	const ratio = imageWidth > imageHeight ? aspectRatio.maximum : aspectRatio.minimum;

	if (imageWidth / imageHeight > aspectRatio.maximum || imageWidth / imageHeight < aspectRatio.minimum) {
		if (ratio <= 1) {
			areaHeight = imageHeight;
			areaWidth = areaHeight * aspectRatio.maximum;
		} else {
			areaWidth = imageWidth;
			areaHeight = areaWidth / aspectRatio.minimum;
		}
	}

	newHeight = Math.min(maxHeight, Math.max(minHeight, areaHeight * 0.8));
	newWidth = Math.min(maxWidth, Math.max(minWidth, areaWidth * 0.8));

	return {
		height: newHeight,
		width: newWidth,
	};
}

export function percentRestrictions({ minWidth, minHeight, maxWidth, maxHeight, imageWidth, imageHeight }) {
	return {
		minWidth: minWidth / 100 * imageWidth,
		minHeight: minHeight / 100 * imageHeight,
		maxWidth: maxWidth / 100 * imageWidth,
		maxHeight: maxHeight / 100 * imageHeight,
	};
}

// The main point of this feature is calculating the needed position of stencil and parameters of world transforms
// Real coordinates don't changes here
export function autoZoom({ coordinates, stencilCoordinates: originalStencilCoordinates, worldTransforms: originalWorldTransforms, coefficient, imageSize, allowedArea }) {
	const worldTransforms = {
		...originalWorldTransforms
	};

	const stencilCoordinates = {
		width: worldTransforms.scale * coordinates.width / coefficient,
		height: worldTransforms.scale * coordinates.height / coefficient,
		left: originalStencilCoordinates.left,
		top: originalStencilCoordinates.top,
	};

	worldTransforms.shift.left -= (coordinates.left * worldTransforms.scale + worldTransforms.shift.left) - originalStencilCoordinates.left * coefficient;
	worldTransforms.shift.top -= (coordinates.top * worldTransforms.scale + worldTransforms.shift.top) - originalStencilCoordinates.top * coefficient;

	// 1. Scale the image, if the stencil is too big
	let multiplier = 1;
	if (stencilCoordinates.width > imageSize.width / coefficient) {
		multiplier = Math.min(multiplier, imageSize.width / coefficient / stencilCoordinates.width);
	}
	if (stencilCoordinates.height > imageSize.height / coefficient) {
		multiplier = Math.min(multiplier, imageSize.height / coefficient / stencilCoordinates.height);
	}

	if (multiplier !== 1) {
		worldTransforms.scale *= multiplier;
		stencilCoordinates.left += stencilCoordinates.width * (1 - multiplier)/2;
		stencilCoordinates.top += stencilCoordinates.height * (1 - multiplier)/2;
		worldTransforms.shift.left = stencilCoordinates.left * coefficient - (coordinates.left) * worldTransforms.scale;
		worldTransforms.shift.top = stencilCoordinates.top * coefficient - (coordinates.top) * worldTransforms.scale;
		stencilCoordinates.width *= multiplier;
		stencilCoordinates.height *= multiplier;
	}

	// 2. Move the stencil to prevent breaking borders
	if (stencilCoordinates.left < 0) {
		worldTransforms.shift.left -= stencilCoordinates.left * coefficient;
		stencilCoordinates.left = 0;
	}

	if (stencilCoordinates.top < 0) {
		worldTransforms.shift.top -= stencilCoordinates.top * coefficient;
		stencilCoordinates.top = 0;
	}

	if (stencilCoordinates.left + stencilCoordinates.width > imageSize.width / coefficient) {
		worldTransforms.shift.left -= (stencilCoordinates.left + stencilCoordinates.width) * coefficient - imageSize.width;
		stencilCoordinates.left = imageSize.width / coefficient - stencilCoordinates.width;
	}

	if (stencilCoordinates.top + stencilCoordinates.height > imageSize.height / coefficient) {
		worldTransforms.shift.top -= (stencilCoordinates.top + stencilCoordinates.height) * coefficient - imageSize.height;
		stencilCoordinates.top = imageSize.height / coefficient - stencilCoordinates.height;
	}

	// 3. Move the image to prevent breaking borders:
	const scaledImageSize = {
		width: imageSize.width * worldTransforms.scale,
		height: imageSize.height * worldTransforms.scale,
	};

	if (worldTransforms.shift.left > -allowedArea.left * worldTransforms.scale) {
		stencilCoordinates.left -= (worldTransforms.shift.left + (allowedArea.left * worldTransforms.scale)) / coefficient;
		worldTransforms.shift.left = -(allowedArea.left * worldTransforms.scale);
	}
	if (worldTransforms.shift.left < imageSize.width - scaledImageSize.width - (allowedArea.right - imageSize.width) * worldTransforms.scale) {
		stencilCoordinates.left -= (worldTransforms.shift.left - (imageSize.width - scaledImageSize.width) + (allowedArea.right - imageSize.width) * worldTransforms.scale) / coefficient;
		worldTransforms.shift.left = imageSize.width - scaledImageSize.width - (allowedArea.right - imageSize.width) * worldTransforms.scale;
	}
	if (worldTransforms.shift.top > -allowedArea.top * worldTransforms.scale) {
		stencilCoordinates.top -= (worldTransforms.shift.top + (allowedArea.top * worldTransforms.scale)) / coefficient;
		worldTransforms.shift.top = -allowedArea.top * worldTransforms.scale;
	}
	if (worldTransforms.shift.top < imageSize.height - scaledImageSize.height - (allowedArea.bottom - imageSize.height) * worldTransforms.scale) {
		stencilCoordinates.top -= (worldTransforms.shift.top - (imageSize.height - scaledImageSize.height) + (allowedArea.bottom - imageSize.height) * worldTransforms.scale) / coefficient;
		worldTransforms.shift.top = imageSize.height - scaledImageSize.height - (allowedArea.bottom - imageSize.height) * worldTransforms.scale;
	}

	return {
		stencilCoordinates,
		worldTransforms
	};
}

export function manipulateImage({ manipulateImageEvent, coordinates, stencilRestrictions, coefficient, stencilCoordinates, worldTransforms: originalWorldTransforms, imageSize, frozenDirections, allowedArea, fitImage }) {
	let { scale, move } = manipulateImageEvent;
	const worldTransforms = { ...originalWorldTransforms };

	const scaledImageSize = {
		width: imageSize.width * worldTransforms.scale,
		height: imageSize.height * worldTransforms.scale,
	};

	const imageShifts = {
		left: move.left || 0,
		top: move.top || 0,
	};

	let scaleImage = 1;
	let scaleStencil = 1;

	const minScale = !fitImage ? Math.max(
		('left' in allowedArea && 'right' in allowedArea) ? stencilCoordinates.width * coefficient / (allowedArea.right - allowedArea.left) : 1e-2,
		('top' in allowedArea && 'bottom' in allowedArea) ? stencilCoordinates.height * coefficient / (allowedArea.bottom - allowedArea.top) : 1e-2,
	) : 1;

	// If there is scaling then begin scale
	if (!frozenDirections.width && !frozenDirections.height && Math.abs(scale.factor - 1) > 1e-3) {
		const epsilon = Math.abs(1 - scaleImage) / 2;
		const { maxWidth, maxHeight, minWidth, minHeight } = stencilRestrictions;

		scaleImage = scale.factor;

		// Determine allowed resize:
		if (worldTransforms.scale / scaleImage < minScale + epsilon) {
			scaleImage = worldTransforms.scale / minScale;
		}

		let width = coordinates.width * scaleImage;
		let height = coordinates.height * scaleImage;

		// Prevent breaking the restrictions
		const breaks = {
			minWidth: width < minWidth + epsilon,
			minHeight: height < minHeight + epsilon,
			maxWidth: width > maxWidth - epsilon,
			maxHeight: height > maxHeight - epsilon,
		};

		if (breaks.minWidth) {
			scaleImage = minWidth / coordinates.width;
		}
		if (breaks.minHeight) {
			scaleImage = minHeight / coordinates.height;
		}
		if (breaks.maxHeight || breaks.maxWidth) {
			let allowedImageScale = scaleImage;
			if (breaks.maxWidth && breaks.maxHeight) {
				allowedImageScale = Math.min(maxHeight / coordinates.height, coordinates.width);
			} else if (breaks.maxHeight) {
				allowedImageScale = maxHeight / coordinates.height;
			} else if (breaks.maxWidth) {
				allowedImageScale = maxWidth / coordinates.width;
			}
			if (worldTransforms.scale * scaleImage >= 1) {
				scaleStencil = allowedImageScale / scaleImage;
			} else {
				scaleImage = allowedImageScale;
			}
		}

		const imageSizeChanges = {
			width: scaledImageSize.width * (1 - 1/scaleImage),
			height:  scaledImageSize.height * (1 - 1/scaleImage),
		};

		imageShifts.left += imageSizeChanges.width * Math.abs((worldTransforms.shift.left - scale.center.left * coefficient) / scaledImageSize.width);
		imageShifts.top += imageSizeChanges.height * Math.abs((worldTransforms.shift.top - scale.center.top * coefficient) / scaledImageSize.height);

		scaledImageSize.width /= scaleImage;
		scaledImageSize.height /= scaleImage;
	}

	worldTransforms.scale = worldTransforms.scale / scaleImage;

	// If the image should not break area boundaries we should change coordinates so they don't break them
	// otherwise we just prevent moving
	if (fitImage) {
		if (Math.ceil(worldTransforms.shift.left + imageShifts.left) > 0) {
			imageShifts.left = -worldTransforms.shift.left;
		} else if (worldTransforms.shift.left + imageShifts.left < imageSize.width - scaledImageSize.width) {
			imageShifts.left = imageSize.width - scaledImageSize.width  - worldTransforms.shift.left;
		}

		if (Math.ceil(worldTransforms.shift.top + imageShifts.top) > 0) {
			imageShifts.top = -worldTransforms.shift.top;
		} else if (worldTransforms.shift.top + imageShifts.top < imageSize.height - scaledImageSize.height) {
			imageShifts.top = imageSize.height - scaledImageSize.height - worldTransforms.shift.top;
		}
	} else {
		const breaks = {};
		ALL_DIRECTIONS.forEach(side => {
			if (side in allowedArea) {
				breaks[side] = (worldTransforms.shift[mainSide(side)] + imageShifts[mainSide(side)]) + (allowedArea[side] * worldTransforms.scale - allSides(stencilCoordinates)[side] * coefficient);
			} else {
				breaks[side] = 0;
			}
		});

		// Process the moving:
		if (breaks.left > 0) {
			imageShifts.left -= breaks.left;
		} else if (breaks.right < 0) {
			imageShifts.left -= breaks.right;
		}
		if (breaks.top > 0) {
			imageShifts.top -= breaks.top;
		} else if (breaks.bottom < 0) {
			imageShifts.top -= breaks.bottom;
		}
	}

	worldTransforms.shift.left += imageShifts.left;
	worldTransforms.shift.top += imageShifts.top;

	const stencilResizeAmends = { left: 0, top: 0 };
	if (imageSize.width !== coordinates.width && worldTransforms.scale >= 1) {
		stencilResizeAmends.left = stencilCoordinates.width * (1 - scaleStencil) * (coordinates.left / (imageSize.width - coordinates.width));
	}
	if (imageSize.height !== coordinates.height && worldTransforms.scale >= 1) {
		stencilResizeAmends.top = stencilCoordinates.height * (1 - scaleStencil) * (coordinates.top / (imageSize.height - coordinates.height));
	}

	return {
		coordinates: {
			width: coordinates.width * scaleImage * scaleStencil,
			height: coordinates.height * scaleImage * scaleStencil,
			left: (stencilCoordinates.left - worldTransforms.shift.left / coefficient + stencilResizeAmends.left) * coefficient / worldTransforms.scale,
			top: (stencilCoordinates.top - worldTransforms.shift.top / coefficient + stencilResizeAmends.top) * coefficient / worldTransforms.scale,
		},
		worldTransforms
	};
}

export function allowedArea({ breakBoundaries, imageSize, worldTransforms, imageRestriction }) {
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
		const boundaries = {
			left: -worldTransforms.shift.left / worldTransforms.scale,
			top: -worldTransforms.shift.top / worldTransforms.scale,
			right: (imageSize.width - worldTransforms.shift.left) / worldTransforms.scale,
			bottom: (imageSize.height - worldTransforms.shift.top) / worldTransforms.scale
		};
		ALL_DIRECTIONS.forEach(direction => {
			if (!isUndefined(limits[direction])) {
				if (direction === 'left' || direction === 'top') {
					limits[direction] = Math.max(limits[direction], boundaries[direction]);
				} else {
					limits[direction] = Math.min(limits[direction], boundaries[direction]);
				}
			} else {
				limits[direction] = boundaries[direction];
			}
		});
	}
	return limits;
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
