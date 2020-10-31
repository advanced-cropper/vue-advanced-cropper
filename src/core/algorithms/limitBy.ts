import { Coordinates, Limits } from "../typings";
import { joinLimits } from "../utils";
import { toLimits } from "../service";

export function limitBy(limits: Limits, object: Coordinates): Limits {
	return joinLimits(limits, toLimits(object));
}
