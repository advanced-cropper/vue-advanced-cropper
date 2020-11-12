import { ImageSize, Point, Size, VisibleArea } from '../typings';

export interface DefaultPositionParams {
	coordinates: Size;
	imageSize?: ImageSize;
	visibleArea?: VisibleArea;
}
export function defaultPosition({ imageSize, visibleArea, coordinates }: DefaultPositionParams): Point {
	const area = visibleArea || imageSize;

	return {
		left: (visibleArea ? visibleArea.left : 0) + area.width / 2 - coordinates.width / 2,
		top: (visibleArea ? visibleArea.top : 0) + area.height / 2 - coordinates.height / 2,
	};
}
