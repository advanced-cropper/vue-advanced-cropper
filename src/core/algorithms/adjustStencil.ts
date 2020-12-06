import {
	adjustSize,
	applyMove,
	applyScale,
	fit,
	fitToLimits,
	getBrokenRatio,
	getIntersections,
	intersectionLimits,
	inverseMove,
	maxScale,
	ratio,
	toLimits,
} from '../service';

import {
	Position,
	Coordinates,
	AreaRestrictions,
	VisibleArea,
	Boundaries,
	GetAreaRestrictions,
	AspectRatio,
	SizeRestrictions,
	PositionRestrictions,
	Size,
	StencilSize,
} from '../typings';
import { isApproximatelyEqual, isFunction, isUndefined } from '../utils';
import { approximatedSize } from './approximatedSize';

export interface AdjustStencilResult {
	coordinates: Coordinates;
	visibleArea: VisibleArea;
}

export interface AdjustStencilSizeParams {
	coefficient: number;
	getAreaRestrictions: GetAreaRestrictions;
	coordinates: Coordinates;
	visibleArea: VisibleArea;
	boundaries: Boundaries;
	aspectRatio: AspectRatio;
	stencilSize: Size;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
}
export function adjustStencilSize(params: AdjustStencilSizeParams): AdjustStencilResult {
	const {
		getAreaRestrictions,
		boundaries,
		coefficient,
		coordinates: originalCoordinates,
		visibleArea: originalVisibleArea,
		aspectRatio,
		stencilSize,
		sizeRestrictions,
		positionRestrictions,
	} = params;

	let coordinates = { ...originalCoordinates };
	let visibleArea = { ...originalVisibleArea };

	// Checks that coordinates has the same ratio that coordinates:
	let stencil = { ...stencilSize };

	if (!isApproximatelyEqual(ratio(stencil), ratio(coordinates))) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(
				`[Adjusting stencil] The aspect ratio of coordinates is not equal to the aspect ratio of stencil (${ratio(
					coordinates,
				)} != ${ratio(stencil)})! Coordinates will be changed`,
			);
		}
		coordinates = {
			...coordinates,
			...approximatedSize({
				sizeRestrictions,
				width: coordinates.width,
				height: coordinates.height,
				aspectRatio: {
					minimum: ratio(stencil),
					maximum: ratio(stencil),
				},
			}),
		};
	}

	// First of all try to resize visible area as much as possible:
	visibleArea = applyScale(visibleArea, (coordinates.width * boundaries.width) / (visibleArea.width * stencil.width));

	// Check that visible area doesn't break the area restrictions:
	const scale = adjustSize(visibleArea, getAreaRestrictions({ visibleArea, type: 'resize' }));
	if (scale !== 1) {
		visibleArea = applyScale(visibleArea, scale);
		coordinates = applyScale(coordinates, scale);
	}

	visibleArea = fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));
	coordinates = fitToLimits(coordinates, intersectionLimits(toLimits(visibleArea), positionRestrictions));

	return {
		coordinates,
		visibleArea,
	};
}
