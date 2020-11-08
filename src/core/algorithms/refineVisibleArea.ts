import { AreaRestrictions, Boundaries, VisibleArea } from '../typings';
import { fitPosition, ratio } from '../service';

interface RefineVisibleAreaParams {
	visibleArea: VisibleArea;
	boundaries: Boundaries;
	areaRestrictions: AreaRestrictions;
}
export function refineVisibleArea(params: RefineVisibleAreaParams): VisibleArea {
	const { visibleArea: previousVisibleArea, boundaries, areaRestrictions } = params;

	let visibleArea = { ...previousVisibleArea };

	const boundariesRatio = ratio(boundaries);
	if (visibleArea.width / visibleArea.height !== boundariesRatio) {
		visibleArea.height = visibleArea.width / boundariesRatio;
	}

	return fitPosition(visibleArea, areaRestrictions);
}
