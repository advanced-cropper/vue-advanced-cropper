const {resize, move} = require('./core')
const {ResizeEvent, MoveEvent} = require('./events')

const EPSILON = 1;
const SMALL_EPSILON = 0.01;
const MAX_IMAGE_SIZE = 4096;

let seed = 1;
const random = () => {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}


test('should fit to conditions (randomized tests)', () => {
	for(let i = 0; i < 1000; i++){

		const conditions = generateConditions();
		const {
			coordinates, restrictions, imageSize, coefficient, aspectRatio, resizeEvent
		} = conditions
		const result = resize(coordinates, restrictions, imageSize, coefficient, aspectRatio, resizeEvent)
		const report = JSON.stringify({i, ...conditions, result})

		const leftBorder = -EPSILON
		const rightBorder = imageSize.width + EPSILON
		const topBorder = -EPSILON
		const bottomBorder = imageSize.height + EPSILON
		const maxHeight = restrictions.maxHeight + EPSILON
		const maxWidth = restrictions.maxWidth + EPSILON
		const minHeight = restrictions.minHeight - EPSILON
		const minWidth = restrictions.minWidth - EPSILON
		const minAspectRatio = aspectRatio.minimum - SMALL_EPSILON
		const maxAspectRatio = aspectRatio.maximum + SMALL_EPSILON

	  	expect(result.width, report).toBeGreaterThanOrEqual(minWidth);
		expect(result.height, report).toBeGreaterThanOrEqual(minHeight);
		expect(result.width, report).toBeLessThanOrEqual(maxWidth);
		expect(result.height, report).toBeLessThanOrEqual(maxHeight);

	    expect(result.left, report).toBeGreaterThanOrEqual(leftBorder);
		expect(result.left + result.width, report).toBeLessThanOrEqual(rightBorder);

		expect(result.top, report).toBeGreaterThanOrEqual(topBorder);
		expect(result.top + result.height, report).toBeLessThanOrEqual(bottomBorder);

	    expect(result.width / result.height, report).toBeLessThanOrEqual(maxAspectRatio);
	    expect(result.width / result.height, report).toBeGreaterThanOrEqual(minAspectRatio);
	}

});

function generateConditions() {
	const imageSize = {
		width: Math.floor(MAX_IMAGE_SIZE * random()),
		height: Math.floor(MAX_IMAGE_SIZE * random()),
	}
	const coordinates = {
		left: Math.floor(imageSize.width * random()),
		top: Math.floor(imageSize.height * random())
	}
	coordinates.width =  Math.floor((imageSize.width - coordinates.left) * random())
	coordinates.height =  Math.floor((imageSize.height - coordinates.top) * random())

	const aspectRatio = {
		minimum: Math.min(coordinates.width / coordinates.height, 2 * random()),
	}
	aspectRatio.maximum = Math.max(coordinates.width / coordinates.height, 2 * random())
	return {
		coordinates,
		restrictions: {
			minHeight: (coordinates.height * random()),
			minWidth: (coordinates.width * random()),
			maxHeight: (coordinates.height + (imageSize.height - coordinates.height) * random()),
			maxWidth: (coordinates.width + (imageSize.width - coordinates.width) * random()),
		},
		imageSize,
		coefficient: 10 * random(),
		aspectRatio,
		resizeEvent: new ResizeEvent({}, {
			left: (1 - 2*random()) * imageSize.width,
			right: (1 - 2*random()) * imageSize.width,
			top: (1 - 2*random()) * imageSize.height,
			bottom: (1 - 2*random()) * imageSize.height,
		})
	}
}
