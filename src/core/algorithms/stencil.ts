import {
	AspectRatio,
	Boundaries,
	Coordinates,
	GetAreaRestrictions,
	PositionRestrictions,
	Size,
	SizeRestrictions,
	StencilSize,
	Position,
	VisibleArea,
	StencilCalculationParams,
} from '../typings';
import { isFunction, isUndefined } from '../utils';
import { adjustSize, applyScale, fitToLimits, getBrokenRatio, intersectionLimits, ratio, toLimits } from '../service';
import { approximatedSize } from './approximatedSize';

export interface CalculateStencilSizeParams {
	aspectRatio: AspectRatio;
	stencilSize: StencilSize;
	boundaries: Boundaries;
}
export function calculateStencilSize(params: CalculateStencilSizeParams): Size {
	const { boundaries, stencilSize, aspectRatio } = params;

	// Checks that coordinates has the same ratio that coordinates:
	let stencil = isFunction(stencilSize)
		? (stencilSize as Function)({ boundaries, aspectRatio })
		: stencilSize;

	if (getBrokenRatio(ratio(stencil), aspectRatio)) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(
				`[Adjusting stencil] The aspect ratio of stencil doesn't correspondent to aspect ratio limitations`,
			);
		}
		stencil = approximatedSize({
			sizeRestrictions: {
				maxWidth: boundaries.width,
				maxHeight: boundaries.height,
				minWidth: 0,
				minHeight: 0,
			},
			width: stencil.width,
			height: stencil.height,
			aspectRatio: {
				minimum: aspectRatio.minimum,
				maximum: aspectRatio.maximum,
			},
		});
	}
	if (stencil.width > boundaries.width || stencil.height > boundaries.height) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(
				`[Adjusting stencil] The width and height of stencil (${stencil.width}, ${stencil.height}) should be fewer or equal to the width and height of boundaries (${boundaries.width},${boundaries.height}) respectively`,
			);
		}
		stencil = approximatedSize({
			sizeRestrictions: {
				maxWidth: boundaries.width,
				maxHeight: boundaries.height,
				minWidth: 0,
				minHeight: 0,
			},
			width: stencil.width,
			height: stencil.height,
			aspectRatio: {
				minimum: ratio(stencil),
				maximum: ratio(stencil),
			},
		});
	}

	return stencil;
}
