import { Boundaries, VisibleArea } from "../typings";
import { ratio } from "../service";

interface RefineVisibleAreaParams {
	visibleArea: VisibleArea;
	boundaries: Boundaries;
}
export function refineVisibleArea({ visibleArea, boundaries }: RefineVisibleAreaParams): VisibleArea {
	const result = { ...visibleArea };
	const boundariesRatio = ratio(boundaries);
	if (result.width / result.height !== boundariesRatio) {
		result.height = result.width / boundariesRatio;
	}
	return result;
}
