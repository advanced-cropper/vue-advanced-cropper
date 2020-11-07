import { approximatedSize } from './approximatedSize';

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

test('Correct approximations', () => {
	tests.forEach((test) => {
		expect(approximatedSize(test.input)).toStrictEqual(test.output);
	});
});
