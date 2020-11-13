import { MoveEvent } from '../events';
import { Coordinates, PositionRestrictions } from '../typings';
import { applyMove, fit } from '../service';

export interface MoveParams {
	event: MoveEvent;
	coordinates: Coordinates;
	positionRestrictions: PositionRestrictions;
}

export function move(params: MoveParams): Coordinates {
	const { event, coordinates, positionRestrictions = {} } = params;

	const movedCoordinates = applyMove(coordinates, event.directions);

	return applyMove(movedCoordinates, fit(movedCoordinates, positionRestrictions));
}
