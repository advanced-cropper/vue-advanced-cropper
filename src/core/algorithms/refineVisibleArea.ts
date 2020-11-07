import { Boundaries, VisibleArea } from '../typings';
import { ratio } from '../service';

interface RefineVisibleAreaParams {
	visibleArea: VisibleArea;
	boundaries: Boundaries;
}
export function refineVisibleArea({ visibleArea, boundaries }: RefineVisibleAreaParams): VisibleArea {
	const result = { ...visibleArea };
	if (boundaries.height === 0 || boundaries.width === 0) {
		return {
			...boundaries,
			top: 0,
			left: 0,
		};
	} else {
		const boundariesRatio = ratio(boundaries);
		if (result.width / result.height !== boundariesRatio) {
			result.height = result.width / boundariesRatio;
		}
		return result;
	}
}
