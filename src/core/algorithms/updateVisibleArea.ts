import { applyMove, applyScale, diff, fit, getCenter, getIntersections, isEqual, maxScale, toLimits } from "../service";
import { Coordinates, AreaRestrictions, VisibleArea } from "../typings";

// This function updates visible area with respect to current transformations and fits
// coordinates to the new visible area
interface UpdateVisibleAreaParams {
	current: VisibleArea;
	previous: VisibleArea;
	areaRestrictions: AreaRestrictions;
	coordinates: Coordinates;
}
export function updateVisibleArea(params: UpdateVisibleAreaParams): VisibleArea {
	const { current, previous, areaRestrictions, coordinates } = params;
	let visibleArea = { ...current };

	if (previous && previous.width && previous.height && !isEqual(current, previous)) {
		// Adapt scale transformations
		if (previous.width > coordinates.width) {
			visibleArea = applyScale(
				visibleArea,
				Math.min(previous.height / visibleArea.height, maxScale(visibleArea, areaRestrictions)),
			);
		} else {
			visibleArea = applyScale(
				visibleArea,
				Math.min(previous.width / visibleArea.width, maxScale(visibleArea, areaRestrictions)),
			);
		}

		// Adapt move transformations
		visibleArea = applyMove(visibleArea, diff(getCenter(previous), getCenter(visibleArea)));

		// Prevent the breaking of limits
		visibleArea = applyMove(visibleArea, fit(visibleArea, areaRestrictions));

		const intersections = getIntersections(coordinates, toLimits(visibleArea));

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
						(visibleArea.width + intersections.top + intersections.bottom) / visibleArea.height,
						maxScale(visibleArea, areaRestrictions),
					),
				);
			}
		}
	}

	return visibleArea;
}
