import {
	HORIZONTAL_DIRECTIONS,
	VERTICAL_DIRECTIONS,
	ALL_DIRECTIONS
} from './constants'

export function resize (coordinates, restrictions, imageSize, coefficient, aspectRatio, resizeEvent) {
	const actualCoordinates = {
		...coordinates,
		right: coordinates.left + coordinates.width,
		bottom: coordinates.top + coordinates.height
	}

	const directions = {
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

	// 1. First step: checks, that desired box not fewer minWidth and minHeight
	let currentWidth = actualCoordinates.width + coefficient * (directions.left + directions.right)
	let currentHeight = actualCoordinates.height + coefficient * (directions.top + directions.bottom)

	if (currentWidth < minWidth) {
		const multiplier = (directions.right + directions.left) ? (minWidth - actualCoordinates.width) / ((directions.right + directions.left) * coefficient) : 0
		HORIZONTAL_DIRECTIONS.forEach(direction => {
			directions[direction] *= multiplier
		})
	}

	if (currentHeight < minHeight) {
		const multiplier = (directions.bottom + directions.top) ? (minHeight - actualCoordinates.height) / ((directions.bottom + directions.top) * coefficient) : 0
		VERTICAL_DIRECTIONS.forEach(direction => {
			directions[direction] *= multiplier
		})
	}

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
			if (currentWidth > currentHeight) {
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

	// 3. Third step: check if desired box with correct aspect ratios break some limits
	currentWidth = actualCoordinates.width + coefficient * (directions.left + directions.right)
	currentHeight = actualCoordinates.height + coefficient * (directions.top + directions.bottom)

	const maxResize = {
		width: Infinity,
		height: Infinity
	}

	if (Math.floor(actualCoordinates.left + actualCoordinates.width + coefficient * directions.right) > imageSize.width) {
		maxResize.width = Math.min(maxResize.width, imageSize.width - (actualCoordinates.left + actualCoordinates.width))
	}
	if (actualCoordinates.left - coefficient * directions.left < 0) {
		maxResize.width = Math.min(maxResize.width, actualCoordinates.left)
	}
	if (currentWidth < minWidth) {
		maxResize.width = Math.min(maxResize.width, minWidth - actualCoordinates.width)
	}
	if (currentWidth > maxWidth) {
		maxResize.width = Math.min(maxResize.width, maxWidth - actualCoordinates.width)
	}

	if (Math.floor(actualCoordinates.top + actualCoordinates.height + coefficient * directions.bottom) > imageSize.height) {
		maxResize.height = Math.min(maxResize.height, imageSize.height - (actualCoordinates.top + actualCoordinates.height))
	}
	if (actualCoordinates.top - coefficient * directions.top < 0) {
		maxResize.height = Math.min(maxResize.height, actualCoordinates.top)
	}
	if (currentHeight < minHeight) {
		maxResize.height = Math.min(maxResize.height, minHeight - actualCoordinates.height)
	}
	if (currentHeight > maxHeight) {
		maxResize.height = Math.min(maxResize.height, maxHeight - actualCoordinates.height)
	}

	const frozenDirections = {
		width: false,
		height: false
	}

	if (maxResize.width !== Infinity && (directions.right + directions.left)) {
		const multiplier = maxResize.width / ((directions.right + directions.left) * coefficient)
		HORIZONTAL_DIRECTIONS.forEach(direction => {
			directions[direction] *= multiplier
		})
		frozenDirections.width = true
	}

	if (maxResize.height !== Infinity && (directions.bottom + directions.top)) {
		const multiplier = maxResize.height / ((directions.bottom + directions.top) * coefficient)
		VERTICAL_DIRECTIONS.forEach(direction => {
			directions[direction] *= multiplier
		})
		frozenDirections.height = true
	}

	// 4. Fourth step: undo some resizes to correspondent with aspect ratio and limits simultaneosly
	const limitedWidth = actualCoordinates.width + coefficient * (directions.left + directions.right)
	const limitedHeight = actualCoordinates.height + coefficient * (directions.top + directions.bottom)

	if (event.shiftKey && limitedWidth / limitedHeight !== actualCoordinates.width / actualCoordinates.height) {
		ratioBroken = actualCoordinates.width / actualCoordinates.height
	} else if (limitedWidth / limitedHeight < aspectRatio.minimum) {
		ratioBroken = aspectRatio.minimum
	} else if (limitedWidth / limitedHeight > aspectRatio.maximum) {
		ratioBroken = aspectRatio.maximum
	}
	if (ratioBroken) {
		if (!frozenDirections.width) {
			const multiplier = (directions.right + directions.left) ? (limitedHeight * ratioBroken - actualCoordinates.width) / ((directions.right + directions.left) * coefficient) : 0
			HORIZONTAL_DIRECTIONS.forEach(direction => {
				directions[direction] *= multiplier
			})
		} else if (!frozenDirections.height) {
			const multiplier = directions.bottom + directions.top ? (limitedWidth / ratioBroken - actualCoordinates.height) / ((directions.top + directions.bottom) * coefficient) : 0
			VERTICAL_DIRECTIONS.forEach(direction => {
				directions[direction] *= multiplier
			})
		} else {
			ALL_DIRECTIONS.forEach(direction => {
				directions[direction] *= 0
			})
		}
	}

	console.log('>>>', {
		currentWidth: coordinates.width,
		width: coordinates.width + coefficient * (directions.right + directions.left),
		right: directions.right
	})

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
	let name, className
	if (hDirection && vDirection) {
		name = `${hDirection}${vDirection[0].toUpperCase()}${vDirection.slice(1)}`
		className = `${hDirection}-${vDirection}`
	} else {
		name = hDirection || vDirection
		className = hDirection || vDirection
	}
	return {name, className}
}
