import {
	HORIZONTAL_DIRECTIONS,
	VERTICAL_DIRECTIONS,
	ALL_DIRECTIONS
} from './constants'

function fitConditions(oldDirections, coordinates, restrictions, coefficient, imageSize, ratioBroken) {

	//console.log(coordinates, restrictions)
	const { minHeight, minWidth, maxHeight, maxWidth } = restrictions
	const directions = {...oldDirections}

	const currentWidth = coordinates.width + coefficient * (directions.left + directions.right)
	const currentHeight = coordinates.height + coefficient * (directions.top + directions.bottom)


	if (currentWidth < 0) {
		directions.left = 0;
		directions.right = -coordinates.width
	}

	if (currentHeight < 0) {
		directions.top = 0;
		directions.bottom = -coordinates.height
	}

	const maxMultiplier = {
		width: Infinity,
		height: Infinity
	}

	if (directions.right + directions.left) {
		// Break right border
		if (Math.floor(coordinates.left + coordinates.width + coefficient * directions.right) > imageSize.width) {
			//console.log('Break right border', maxMultiplier)

			maxMultiplier.width = Math.min(
				maxMultiplier.width,
				Math.abs((imageSize.width - (coordinates.left + coordinates.width)) / (coefficient * directions.right))
			)
		}
		// Break left border
		if (coordinates.left - coefficient * directions.left < 0) {
			//console.log('Break lefft border', maxMultiplier)

			maxMultiplier.width = Math.min(
				maxMultiplier.width,
				Math.abs((coordinates.left) / (coefficient * directions.left))
			)
		}

		// Break min width
		if (currentWidth < minWidth) {
			//console.log('Break min width', maxMultiplier)


			maxMultiplier.width = Math.min(
				maxMultiplier.width,
				Math.abs((coordinates.width - minWidth) / ((directions.right + directions.left) * coefficient))
			)
		}
		// Break max width
		if (currentWidth > maxWidth) {
			//console.log('Break max width', maxMultiplier)
			maxMultiplier.width = Math.min(
				maxMultiplier.width,
				Math.abs((maxWidth - coordinates.width) / ((directions.right + directions.left) * coefficient))
			)
		}
	}

	if (directions.top + directions.bottom) {
		// Break bottom border
		if (Math.floor(coordinates.top + coordinates.height + coefficient * directions.bottom) > imageSize.height) {
			//console.log('Break bottom border', maxMultiplier)
			maxMultiplier.height = Math.min(
				maxMultiplier.height,
				Math.abs((imageSize.height - (coordinates.top + coordinates.height)) / (coefficient * directions.bottom))
			)
		}
		// Break top border
		if (coordinates.top - coefficient * directions.top < 0) {
			//console.log('Break top border', maxMultiplier)

			maxMultiplier.height = Math.min(
				maxMultiplier.height,
				Math.abs((coordinates.top) / (coefficient * directions.top))
			)
		}
		// Break min height
		if (currentHeight < minHeight) {
			//console.log('Break  min height', maxMultiplier)

			maxMultiplier.height = Math.min(
				maxMultiplier.height,
				Math.abs((coordinates.height - minHeight) / ((directions.top + directions.bottom) * coefficient))
			)
		}
		// Break max height
		if (currentHeight > maxHeight) {
			//console.log('Break  max height', maxMultiplier,maxHeight - coordinates.height,(directions.top + directions.bottom) * coefficient )
			maxMultiplier.height = Math.min(
				maxMultiplier.height,
				Math.abs((maxHeight - coordinates.height) / ((directions.top + directions.bottom) * coefficient))
			)
		}
	}

	//console.log('>>>', maxMultiplier, directions, coefficient, currentWidth)

	if (!ratioBroken) {
		if (maxMultiplier.width !== Infinity) {
			HORIZONTAL_DIRECTIONS.forEach(direction => {
				directions[direction] *= maxMultiplier.width
			})
		}
		if (maxMultiplier.height !== Infinity) {
			VERTICAL_DIRECTIONS.forEach(direction => {
				directions[direction] *= maxMultiplier.height
			})
		}
	} else {
		let multiplier
		if (maxMultiplier.height < maxMultiplier.width) {
			multiplier = maxMultiplier.height
		} else if (directions.right + directions.left) {
			multiplier = maxMultiplier.width
		}

		if (maxMultiplier.height !== Infinity || maxMultiplier.width !== Infinity) {
			ALL_DIRECTIONS.forEach(direction => {
				directions[direction] *= multiplier
			})
		}
	}

	return directions;
}

export function resize (coordinates, restrictions, imageSize, coefficient, aspectRatio, resizeEvent) {
	const actualCoordinates = {
		...coordinates,
		right: coordinates.left + coordinates.width,
		bottom: coordinates.top + coordinates.height
	}

	let directions = {
		...resizeEvent.directions
	}

	let respectDirection = resizeEvent.respectDirection

	const allowedDirections = resizeEvent.allowedDirections || {
		left: true,
		right: true,
		bottom: true,
		top: true
	}

	Object.keys(allowedDirections).forEach(direction => {
		if (!allowedDirections[direction]) {
			directions[direction] = 0
		}
	})

	const event = resizeEvent.nativeEvent || {}

	// Variables for readbility
	const {
		minHeight,
		minWidth,
		maxWidth,
		maxHeight
	} = restrictions

	let currentWidth = actualCoordinates.width + coefficient * (directions.left + directions.right)
	let currentHeight = actualCoordinates.height + coefficient * (directions.top + directions.bottom)

	// 1. First step: fit desired box to existing limits to prevent unpredictable behaviour during aspect ratio fixing
	directions = fitConditions(directions, actualCoordinates, restrictions, coefficient, imageSize);

	// 2. Second step: fix desired box to correspondent to aspect ratio
	currentWidth = actualCoordinates.width + coefficient * (directions.left + directions.right)
	currentHeight = actualCoordinates.height + coefficient * (directions.top + directions.bottom)

	// Checks ratio:
	let ratioBroken = null
	if (event.shiftKey) {
		ratioBroken = actualCoordinates.width / actualCoordinates.height
	} else if (aspectRatio.minimum && currentWidth / currentHeight < aspectRatio.minimum) {
		ratioBroken = aspectRatio.minimum
	} else if (aspectRatio.maximum && currentWidth / currentHeight > aspectRatio.maximum) {
		ratioBroken = aspectRatio.maximum
	}

	if (ratioBroken) {
		if (!respectDirection) {
			if (actualCoordinates.width > actualCoordinates.height) {
				respectDirection = 'width'
			} else {
				respectDirection = 'height'
			}
		}
		if (currentWidth / ratioBroken >= minHeight && respectDirection === 'width') {
			let overlapHeight = actualCoordinates.height - currentWidth / ratioBroken
			if (allowedDirections.top && allowedDirections.bottom) {
				directions.bottom = -overlapHeight / (2 * coefficient)
				directions.top = -overlapHeight / (2 * coefficient)
			} else if (allowedDirections.top) {
				directions.top = -overlapHeight / coefficient
			} else if (allowedDirections.bottom) {
				directions.bottom = -overlapHeight / coefficient
			} else if (allowedDirections.right) {
				directions.right = 0
			} else if (allowedDirections.left) {
				directions.left = 0
			}
		} else if (currentHeight * ratioBroken >= minWidth && respectDirection === 'height') {
			let overlapWidth = actualCoordinates.width - currentHeight * ratioBroken
			if (allowedDirections.left && allowedDirections.right) {
				directions.left = -overlapWidth / (2 * coefficient)
				directions.right = -overlapWidth / (2 * coefficient)
			} else if (allowedDirections.left) {
				directions.left = -overlapWidth / coefficient
			} else if (allowedDirections.right) {
				directions.right = -overlapWidth / coefficient
			} else if (allowedDirections.top) {
				directions.top = 0
			} else if (allowedDirections.bottom) {
				directions.bottom = 0
			}
		} else {
			ALL_DIRECTIONS.forEach(direction => {
				directions[direction] *= 0
			})
		}
	}

	// 3. Third step: check if desired box with correct aspect ratios break some limits and fit to this conditions
	directions = fitConditions(directions, actualCoordinates, restrictions, coefficient, imageSize, ratioBroken);

	return {
		width: coordinates.width + coefficient * (directions.right + directions.left),
		height: coordinates.height + coefficient * (directions.top + directions.bottom),
		left: coordinates.left - coefficient * directions.left,
		top: coordinates.top - coefficient * directions.top
	}
}

export function move (coordinates, restrictions, imageSize, coefficient, resizeEvent) {
	const directions = {
		...resizeEvent.directions
	}

	const newCoordinates = {
		left: coordinates.left + coefficient * directions.left,
		top: coordinates.top + coefficient * directions.top,
		width: coordinates.width,
		height: coordinates.height
	}

	if (newCoordinates.left < 0) {
		newCoordinates.left = 0
	}
	if (newCoordinates.left + newCoordinates.width > imageSize.width) {
		newCoordinates.left = Math.max(0, imageSize.width - newCoordinates.width)
	}
	if (newCoordinates.top < 0) {
		newCoordinates.top = 0
	}
	if (newCoordinates.top + newCoordinates.height > imageSize.height) {
		newCoordinates.top = Math.max(0, imageSize.height - newCoordinates.height)
	}

	return newCoordinates
}

export function areaSize (cropper, image) {
	const imageWidth = image.naturalWidth
	const imageHeight = image.naturalHeight
	const areaHeight = cropper.clientHeight
	const areaWidth = cropper.clientWidth

	let currentHeight = areaHeight
	let currentWidth = imageWidth * areaHeight / imageHeight

	if (currentWidth > areaWidth) {
		currentWidth = areaWidth
		currentHeight = imageHeight * areaWidth / imageWidth
	}

	return {
		width: currentWidth,
		height: currentHeight
	}
}

export function defaultPosition (cropper, image, width, height, props) {
	return {
		left: image.naturalWidth / 2 - width / 2,
		top: image.naturalHeight / 2 - height / 2
	}
}

export function defaultSize (cropper, image, props) {
	const maxWidth = props.maxWidth / 100 * image.naturalWidth
	const maxHeight = props.maxHeight / 100 * image.naturalHeight
	const minWidth = props.minWidth / 100 * image.naturalWidth
	const minHeight = props.minHeight / 100 * image.naturalHeight

	let newHeight, newWidth
	if (maxHeight > maxWidth) {
		newHeight = Math.max(minHeight, maxHeight * 0.8)
		newWidth = Math.max(minWidth, maxWidth * 0.8)
	} else {
		newWidth = Math.max(minWidth, maxWidth * 0.8)
		newHeight = Math.max(minHeight, maxHeight * 0.8)
	}

	return {
		height: newHeight,
		width: newWidth
	}
}

export function directionNames (hDirection, vDirection) {
	let name, classname
	if (hDirection && vDirection) {
		name = `${hDirection}${vDirection[0].toUpperCase()}${vDirection.slice(1)}`
		classname = `${hDirection}-${vDirection}`
	} else {
		name = hDirection || vDirection
		classname = hDirection || vDirection
	}
	return {name, classname}
}
