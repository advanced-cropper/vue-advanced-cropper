import { Coordinates, PositionRestrictions, SizeRestrictions } from '../typings';

export interface RoundCoordinatesParams {
	coordinates: Coordinates;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
}
export function roundCoordinates({
	coordinates,
	sizeRestrictions,
	positionRestrictions,
}: RoundCoordinatesParams): Coordinates {
	const roundedCoordinates = {
		width: Math.round(coordinates.width),
		height: Math.round(coordinates.height),
		left: Math.round(coordinates.left),
		top: Math.round(coordinates.top),
	};

	if (roundedCoordinates.width > sizeRestrictions.maxWidth) {
		roundedCoordinates.width = Math.floor(coordinates.width);
	} else if (roundedCoordinates.width < sizeRestrictions.minWidth) {
		roundedCoordinates.width = Math.ceil(coordinates.width);
	}
	if (roundedCoordinates.height > sizeRestrictions.maxHeight) {
		roundedCoordinates.height = Math.floor(coordinates.height);
	} else if (roundedCoordinates.height < sizeRestrictions.minHeight) {
		roundedCoordinates.height = Math.ceil(coordinates.height);
	}
	if (
		positionRestrictions.left !== undefined &&
		(roundedCoordinates.left < positionRestrictions.left ||
			(positionRestrictions.right !== undefined &&
				roundedCoordinates.left + roundedCoordinates.width > positionRestrictions.right))
	) {
		roundedCoordinates.left = Math.floor(positionRestrictions.left);
	}
	if (
		positionRestrictions.top !== undefined &&
		(roundedCoordinates.top < positionRestrictions.top ||
			(positionRestrictions.bottom !== undefined &&
				roundedCoordinates.top + roundedCoordinates.height > positionRestrictions.bottom))
	) {
		roundedCoordinates.top = Math.floor(positionRestrictions.top);
	}

	return roundedCoordinates;
}
