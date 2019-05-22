import {resize, move} from './core'
import {ResizeEvent, MoveEvent} from './events'

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
