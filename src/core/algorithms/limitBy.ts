import { Coordinates, Limits } from '../typings';
import { joinLimits } from '../service';
import { toLimits } from '../service';

export function limitBy(limits: Limits, object: Coordinates): Limits {
	return joinLimits(limits, toLimits(object));
}
