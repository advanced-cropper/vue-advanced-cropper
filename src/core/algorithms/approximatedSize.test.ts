import { approximatedSize } from './approximatedSize';
import { mockRandom } from '../testing';
import { AspectRatio } from '../typings';

const tests = [
	{
		input: {
			width: 100,
			height: 100,
			sizeRestrictions: {
				minHeight: 0,
				minWidth: 0,
				maxWidth: 50,
				maxHeight: 50,
			},
		},
		output: {
			width: 50,
			height: 50,
		},
	},
	{
		input: {
			width: 100,
			height: 100,
			sizeRestrictions: {
				minHeight: 0,
				minWidth: 0,
				maxWidth: 50,
				maxHeight: 100,
			},
		},
		output: {
			width: 50,
			height: 100,
		},
	},
	{
		input: {
			width: 100,
			height: 100,
			aspectRatio: {
				minimum: 1 / 2,
				maximum: 1 / 2,
			},
			sizeRestrictions: {
				minHeight: 0,
				minWidth: 0,
				maxWidth: 50,
				maxHeight: 100,
			},
		},
		output: {
			width: 50,
			height: 100,
		},
	},
];

test('Should return result in ANY POSSIBLE situations', () => {
	const random = mockRandom();
	const iterations = 20;
	for (let i = 0; i < iterations; i++) {
		const minWidth = random() * 100;
		const minHeight = random() * 100;
		const maxWidth = minWidth + random() * 100;
		const maxHeight = minHeight + random() * 100;
		const aspectRatio: AspectRatio = {};

		if (random() > 0.5) {
			aspectRatio.minimum = random() * 3;
		}
		if (random() > 0.5) {
			if (aspectRatio.minimum) {
				aspectRatio.maximum = aspectRatio.minimum + random() * 3;
			} else {
				aspectRatio.maximum = random() * 3;
			}
		}

		const params = {
			width: random() * 100,
			height: random() * 100,
			aspectRatio,
			sizeRestrictions: {
				minWidth,
				minHeight,
				maxHeight,
				maxWidth,
			},
		};

		expect(approximatedSize(params)).not.toBeFalsy();
	}
});
