import { Size, VisibleArea, Coordinates, AreaRestrictions } from '../typings';
import { applyMove, ratio, toLimits, fit, intersectionLimits, unionLimits } from '../service';

interface DefaultVisibleAreaParams {
	imageSize: Size;
	boundaries: Size;
	coordinates?: Coordinates;
	areaRestrictions: AreaRestrictions;
}
export function defaultVisibleArea(params: DefaultVisibleAreaParams): VisibleArea {
	const { areaRestrictions, coordinates, imageSize, boundaries } = params;

	const imageRatio = ratio(imageSize);
	const boundaryRatio = ratio(boundaries);

	const areaProperties = {
		height: imageRatio > boundaryRatio ? imageSize.height : imageSize.width / boundaryRatio,
		width: imageRatio > boundaryRatio ? imageSize.height * boundaryRatio : imageSize.width,
	};

	const visibleArea = {
		left: coordinates
			? coordinates.left + coordinates.width / 2 - areaProperties.width / 2
			: imageSize.width / 2 - areaProperties.width / 2,
		top: coordinates
			? coordinates.top + coordinates.height / 2 - areaProperties.height / 2
			: imageSize.height / 2 - areaProperties.height / 2,
		width: areaProperties.width,
		height: areaProperties.height,
	};

	if (coordinates) {
		return applyMove(
			visibleArea,
			fit(
				visibleArea,
				unionLimits(
					toLimits(coordinates),
					intersectionLimits(areaRestrictions, toLimits({ left: 0, top: 0, ...imageSize })),
				),
			),
		);
	} else {
		return visibleArea;
	}
}
