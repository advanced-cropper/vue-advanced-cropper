import { Size, VisibleArea, Coordinates, GetAreaRestrictions, Limits, Falsy } from '../typings';
import { ratio, toLimits, intersectionLimits, fitToLimits, getIntersections, fitSize, limitsToSize } from '../service';

export interface DefaultVisibleAreaParams {
	imageSize: Size;
	boundaries: Size;
	coordinates?: Coordinates | Falsy;
	getAreaRestrictions: GetAreaRestrictions;
}
export function defaultVisibleArea(params: DefaultVisibleAreaParams): VisibleArea {
	const { getAreaRestrictions, coordinates, imageSize, boundaries } = params;

	const boundaryRatio = ratio(boundaries);

	if (coordinates) {
		// Visible area will try to fit reference:
		const reference = {
			height: Math.max(coordinates.height, imageSize.height),
			width: Math.max(coordinates.width, imageSize.width),
		};

		const areaProperties = fitSize(
			{
				width: ratio(reference) > boundaryRatio ? reference.width : reference.height * boundaryRatio,
				height: ratio(reference) > boundaryRatio ? reference.width / boundaryRatio : reference.height,
			},
			limitsToSize(getAreaRestrictions()),
		);

		// Visible area will try to center stencil:
		const visibleArea = {
			left: coordinates.left + coordinates.width / 2 - areaProperties.width / 2,
			top: coordinates.top + coordinates.height / 2 - areaProperties.height / 2,
			width: areaProperties.width,
			height: areaProperties.height,
		};

		// TODO: Controversial behavior:
		// If the coordinates are beyond image visible area will be allowed to be beyond image alike:
		const coordinatesIntersection = getIntersections(
			coordinates,
			toLimits({
				left: 0,
				top: 0,
				...imageSize,
			}),
		);

		const limits: Limits = {};

		if (!coordinatesIntersection.left && !coordinatesIntersection.right && visibleArea.width <= imageSize.width) {
			limits.left = 0;
			limits.right = imageSize.width;
		}

		if (!coordinatesIntersection.top && !coordinatesIntersection.bottom && visibleArea.height <= imageSize.height) {
			limits.top = 0;
			limits.bottom = imageSize.height;
		}

		return fitToLimits(visibleArea, limits);
	} else {
		const imageRatio = ratio(imageSize);

		const areaProperties = {
			height: imageRatio > boundaryRatio ? imageSize.height : imageSize.width / boundaryRatio,
			width: imageRatio > boundaryRatio ? imageSize.height * boundaryRatio : imageSize.width,
		};

		return {
			left: imageSize.width / 2 - areaProperties.width / 2,
			top: imageSize.height / 2 - areaProperties.height / 2,
			width: areaProperties.width,
			height: areaProperties.height,
		};
	}
}
