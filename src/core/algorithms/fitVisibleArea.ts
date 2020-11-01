import {
	applyMove,
	applyScale,
	diff,
	fit,
	getCenter,
	getIntersections,
	inverseMove,
	isEqual,
	maxScale,
	ratio,
	toLimits,
} from '../service';
import { Coordinates, AreaRestrictions, VisibleArea, Boundaries } from '../typings';

// This function updates visible area with respect to current transformations and fits
// coordinates to the new visible area
interface FitVisibleAreaParams {
	coordinates: Coordinates;
	visibleArea: VisibleArea;
	boundaries: Boundaries;
	areaRestrictions: AreaRestrictions;
}
export function fitVisibleArea(params: FitVisibleAreaParams): VisibleArea {
	const { visibleArea: previousVisibleArea, boundaries, areaRestrictions, coordinates } = params;

	let visibleArea = { ...previousVisibleArea };

	visibleArea.height = visibleArea.width / ratio(boundaries);
	visibleArea.top += (previousVisibleArea.height - visibleArea.height) / 2;

	if (coordinates.height - visibleArea.height > 0 || coordinates.width - visibleArea.width > 0) {
		visibleArea = applyScale(
			visibleArea,
			Math.max(coordinates.height / visibleArea.height, coordinates.width / visibleArea.height),
		);
	}

	const intersections = getIntersections(visibleArea, areaRestrictions);

	if (intersections.left + intersections.right + intersections.top + intersections.bottom) {
		if (intersections.left + intersections.right > intersections.top + intersections.bottom) {
			visibleArea = applyScale(
				visibleArea,
				Math.min(
					(visibleArea.width + intersections.left + intersections.right) / visibleArea.width,
					maxScale(visibleArea, areaRestrictions),
				),
			);
		} else {
			visibleArea = applyScale(
				visibleArea,
				Math.min(
					(visibleArea.height + intersections.top + intersections.bottom) / visibleArea.height,
					maxScale(visibleArea, areaRestrictions),
				),
			);
		}
	}

	return visibleArea;
}
