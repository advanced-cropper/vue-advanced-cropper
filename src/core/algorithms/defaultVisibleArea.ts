import { Size, VisibleArea, Coordinates, AreaRestrictions, Limits } from '../typings';
import {
	ratio,
	toLimits,
	intersectionLimits,
	fitPosition,
	getIntersections
} from '../service';

interface DefaultVisibleAreaParams {
	imageSize: Size;
	boundaries: Size;
	coordinates?: Coordinates;
	areaRestrictions: AreaRestrictions;
}
export function defaultVisibleArea(params: DefaultVisibleAreaParams): VisibleArea {
	const { areaRestrictions, coordinates, imageSize, boundaries } = params;

	const boundaryRatio = ratio(boundaries);

	if (coordinates) {
		const reference = {
			height: Math.max(coordinates.height, imageSize.height),
			width: Math.max(coordinates.width, imageSize.width),
		};

		const referenceRatio = ratio(reference);

		const areaProperties = {
			width: referenceRatio > boundaryRatio ? reference.width : reference.height * boundaryRatio,
			height: referenceRatio > boundaryRatio ? reference.width / boundaryRatio : reference.height,
		};

		const visibleArea = {
			left: coordinates.left + coordinates.width / 2 - areaProperties.width / 2,
			top: coordinates.top + coordinates.height / 2 - areaProperties.height / 2,
			width: areaProperties.width,
			height: areaProperties.height,
		};

		const coordinatesIntersection = getIntersections(
			coordinates,
			toLimits({
				left: 0,
				top: 0,
				...imageSize,
			}),
		);

		const limits: Limits = {};

		if (!coordinatesIntersection.left && !coordinatesIntersection.right) {
			limits.left = 0;
			limits.right = imageSize.width;
		}

		if (!coordinatesIntersection.top && !coordinatesIntersection.bottom) {
			limits.top = 0;
			limits.bottom = imageSize.height;
		}

		return fitPosition(visibleArea, intersectionLimits(limits, areaRestrictions));
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
