import { getOptions } from './utils';
import { defaultSize } from './algorithms';

test('Should correctly get options', () => {
	const defaultScheme = {
		touch: true,
		wheel: {
			ratio: 0.1,
		},
		adjustStencil: false,
	};

	const falseScheme = {
		touch: false,
		wheel: false,
		adjustStencil: false,
	};

	expect(getOptions(true, defaultScheme, falseScheme)).toEqual(defaultScheme);

	expect(getOptions(false, defaultScheme, falseScheme)).toEqual(falseScheme);

	expect(
		getOptions(
			{
				touch: false,
			},
			defaultScheme,
			falseScheme,
		),
	).toEqual({
		...defaultScheme,
		touch: false,
	});

	expect(
		getOptions(
			{
				wheel: false,
			},
			defaultScheme,
			falseScheme,
		),
	).toEqual({
		...defaultScheme,
		wheel: false,
	});

	expect(
		getOptions(
			{
				wheel: {
					ratio: 1,
				},
			},
			defaultScheme,
			falseScheme,
		),
	).toEqual({
		...defaultScheme,
		wheel: {
			ratio: 1,
		},
	});
});
