import { Point, Size, VisibleArea } from "../typings";

export interface DefaultPositionParams {
	visibleArea: VisibleArea;
	coordinates: Size;
}
export function defaultPosition({ visibleArea, coordinates }: DefaultPositionParams): Point {
	return {
		left: visibleArea.left + visibleArea.width / 2 - coordinates.width / 2,
		top: visibleArea.top + visibleArea.height / 2 - coordinates.height / 2,
	};
}
