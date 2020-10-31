import { AspectRatio, Coordinates, PositionRestrictions, SizeRestrictions, VisibleArea } from "../typings";
import { approximatedSize } from "./approximatedSize";
import { applyMove, diff, fit, getCenter } from "../service";

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

	let coordinates = { ...previousCoordinates };
	if (coordinates && coordinates.width && coordinates.height) {
		coordinates = {
			...coordinates,
			...approximatedSize({
				width: coordinates.width,
				height: coordinates.height,
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

		coordinates = applyMove(coordinates, fit(coordinates, positionRestrictions));
	}
	return coordinates;
}
