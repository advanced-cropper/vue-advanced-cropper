import {
	adjustSize,
	applyMove,
	applyScale,
	fit,
	fitToLimits,
	getIntersections,
	inverseMove,
	maxScale,
	ratio,
	toLimits,
} from '../service';
import { Coordinates, AreaRestrictions, VisibleArea, Boundaries, GetAreaRestrictions } from '../typings';

// This function updates visible area with respect to current transformations and fits
// coordinates to the new visible area
export interface FitVisibleAreaParams {
	getAreaRestrictions: GetAreaRestrictions;
	coordinates: Coordinates;
	visibleArea: VisibleArea;
	boundaries: Boundaries;
}
export function fitVisibleArea(params: FitVisibleAreaParams): VisibleArea {
	const { visibleArea: previousVisibleArea, boundaries, getAreaRestrictions, coordinates } = params;

	let visibleArea = { ...previousVisibleArea };

	// Scale visible area size to fit new boundaries:
	visibleArea.height = visibleArea.width / ratio(boundaries);
	visibleArea.top += (previousVisibleArea.height - visibleArea.height) / 2;

	// Scale visible area to prevent overlap coordinates
	if (coordinates.height - visibleArea.height > 0 || coordinates.width - visibleArea.width > 0) {
		visibleArea = applyScale(
			visibleArea,
			Math.max(coordinates.height / visibleArea.height, coordinates.width / visibleArea.width),
		);
	}

	// Scale visible area to prevent overlap area restrictions
	visibleArea = applyScale(
		visibleArea,
		adjustSize(visibleArea, getAreaRestrictions({ visibleArea, type: 'resize' })),
	);

	// Move visible are to prevent moving of the coordinates:
	const move = inverseMove(fit(coordinates, toLimits(visibleArea)));
	if (visibleArea.width < coordinates.width) {
		move.left = 0;
	}
	if (visibleArea.height < coordinates.height) {
		move.top = 0;
	}
	visibleArea = applyMove(visibleArea, move);

	// Move visible area to prevent overlap the area restrictions
	visibleArea = fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));

	return visibleArea;
}
