import { AspectRatio, Coordinates, PositionRestrictions, SizeRestrictions, VisibleArea } from '../typings';
import { approximatedSize } from './approximatedSize';
import { applyMove, diff, fit, getCenter, getIntersections, toLimits } from '../service';
import { joinLimits } from '../utils';

export interface FitCoordinatesParams {
	visibleArea: VisibleArea;
	coordinates: Coordinates;
	aspectRatio: AspectRatio;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
}

export function fitCoordinates(params: FitCoordinatesParams): Coordinates {
	const {
		visibleArea,
		coordinates: previousCoordinates,
		aspectRatio,
		sizeRestrictions,
		positionRestrictions,
	} = params;

	let coordinates = {
		...previousCoordinates,
		...approximatedSize({
			width: previousCoordinates.width,
			height: previousCoordinates.height,
			aspectRatio,
			sizeRestrictions: {
				maxWidth: visibleArea.width,
				maxHeight: visibleArea.height,
				minHeight: Math.min(visibleArea.height, sizeRestrictions.minHeight),
				minWidth: Math.min(visibleArea.width, sizeRestrictions.minWidth),
			},
		}),
	};

	coordinates = applyMove(coordinates, diff(getCenter(previousCoordinates), getCenter(coordinates)));

	coordinates = applyMove(coordinates, fit(coordinates, joinLimits(toLimits(visibleArea), positionRestrictions)));

	return coordinates;
}
