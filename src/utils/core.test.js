const {resize, move} = require('./core')
const {ResizeEvent, MoveEvent} = require('./events')

const MAX_IMAGE_SIZE = 4096;
let seed = 1;
const random = () => {
	const x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}

const areas = {
	square: {
		width: 100,
		height: 100
	},
	long: {
		width: 150,
		height: 50
	},
	tall: {
		width: 50,
		height: 150
	}
}

const restrictions = {
	default: {
		minHeight: 20,
		maxHeight: 100,
		minWidth: 20,
		maxWidth: 100
	},
	tall: {
		minHeight: 20,
		maxHeight: 80,
		minWidth: 20,
		maxWidth: 30
	},
	long: {
		minHeight: 20,
		maxHeight: 30,
		minWidth: 20,
		maxWidth: 80
	}
}

const coefficients = {
	small: 0.25,
	equal: 1,
	big: 5
}

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
		minimum: Math.max(coordinates.width / coordinates.height, 2 * random()),
	}
	aspectRatio.maximum = Math.max(aspectRatio.minimum, 2 * random())
	return {
		coordinates,
		restrictions: {
			minHeight: 100 * (coordinates.height * random()) / imageSize.height,
			minWidth: 100 * (coordinates.width * random()) / imageSize.width,
			maxHeight: 100 * (coordinates.height + (imageSize.height - coordinates.height) * random()) / imageSize.height,
			maxWidth: 100 * (coordinates.width + (imageSize.width - coordinates.width) * random()) / imageSize.width,
		},
		imageSize,
		coefficient: 10 * random(),
		aspectRatio,
		resizeEvent: new ResizeEvent({}, {
			left: random() * imageSize.width,
			right: random() * imageSize.width,
			top: random() * imageSize.height,
			bottom: random() * imageSize.height,
		})
	}
}

test('should fit to conditions (randomized tests)', () => {
	for(let i = 0; i < 1000; i++){

		const conditions = generateConditions();
		const {
			coordinates, restrictions, imageSize, coefficient, aspectRatio, resizeEvent
		} = conditions
		const result = resize(coordinates, restrictions, imageSize, coefficient, aspectRatio, resizeEvent)
		const report = JSON.stringify({i, ...conditions, result})

		const leftBorder = 0
		const rightBorder = imageSize.width + 1
		const topBorder = 0
		const bottomBorder = imageSize.height + 1
		const maxHeight = imageSize.height / 100 * restrictions.maxHeight + 1
		const maxWidth = imageSize.width / 100 * restrictions.maxWidth + 1
		const minHeight = imageSize.height / 100 * restrictions.minHeight - 1
		const minWidth = imageSize.width / 100 * restrictions.minWidth -+ 1

	  	expect(result.width, report).toBeGreaterThan(minWidth);
		expect(result.height, report).toBeGreaterThan(minHeight);
		expect(result.width, report).toBeLessThan(maxWidth);
		expect(result.height, report).toBeLessThan(maxHeight);

	    expect(result.left, report).toBeGreaterThan(leftBorder);
		expect(result.left + result.width, report).toBeLessThan(rightBorder);

		expect(result.top, report).toBeGreaterThan(topBorder);
	    expect(result.top + result.height, report).toBeLessThan(bottomBorder);
	}

});
