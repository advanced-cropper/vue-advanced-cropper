import { GetAreaRestrictions, Boundaries, VisibleArea } from '../typings';
import { fitToLimits, ratio } from '../service';

interface RefineVisibleAreaParams {
	visibleArea: VisibleArea;
	boundaries: Boundaries;
	getAreaRestrictions: GetAreaRestrictions;
}
export function refineVisibleArea(params: RefineVisibleAreaParams): VisibleArea {
	const { visibleArea: previousVisibleArea, boundaries, getAreaRestrictions } = params;

	let visibleArea = { ...previousVisibleArea };

	const boundariesRatio = ratio(boundaries);
	if (visibleArea.width / visibleArea.height !== boundariesRatio) {
		visibleArea.height = visibleArea.width / boundariesRatio;
	}

	return fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));
}
