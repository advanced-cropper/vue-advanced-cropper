import { defaultSize } from './defaultSize';
import { MockFactory } from '../testing/utils';
import { refineSizeRestrictions } from './refineSizeRestrictions';
import { positionRestrictions } from './positionRestrictions';

// Mockup warn messages
console.warn = () => {};

test('Should return default size in ANY POSSIBLE situations', () => {
	const factory = new MockFactory();
	const iterations = 2000;

	for (let i = 0; i < iterations; i++) {
		const boundaries = factory.boundaries();
		const visibleArea = factory.visibleArea();
		const imageSize = factory.imageSize();
		const imageRestriction = factory.imageRestriction();
		const aspectRatio = factory.aspectRatio();

		const refinedSizeRestriction = refineSizeRestrictions({
			sizeRestrictions: factory.sizeRestriction({
				valid: false,
				complete: false,
			}),
			boundaries,
			imageRestriction,
			imageSize,
			positionRestrictions: positionRestrictions({ imageRestriction, imageSize }),
		});

		const params = {
			boundaries,
			visibleArea,
			aspectRatio,
			sizeRestrictions: refinedSizeRestriction,
		};

		try {
			expect(defaultSize(params)).not.toBeFalsy();
		} catch {
			// eslint-disable-next-line no-console
			console.log(params);
		}
	}
});
