import { refineSizeRestrictions } from './refineSizeRestrictions';
import { MockFactory } from '../testing/utils';
import { positionRestrictions } from './positionRestrictions';

// Mockup warn messages
console.warn = () => {};

test('Should sets correct restrictions in ANY situation', () => {
	const factory = new MockFactory();

	const iterations = 2000;

	for (let i = 0; i < iterations; i++) {
		const boundaries = factory.boundaries();
		const visibleArea = factory.visibleArea();
		const imageSize = factory.imageSize();
		const imageRestriction = factory.imageRestriction();

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

		expect(refinedSizeRestriction.minWidth).toBeLessThanOrEqual(refinedSizeRestriction.maxWidth);
		expect(refinedSizeRestriction.minHeight).toBeLessThanOrEqual(refinedSizeRestriction.maxHeight);
	}
});
