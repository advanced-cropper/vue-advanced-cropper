import { ImageRestriction, Limits, Size } from '../typings';

export interface PositionRestrictionsParams {
	imageRestriction: ImageRestriction;
	imageSize: Size;
}
export function positionRestrictions({ imageSize, imageRestriction }: PositionRestrictionsParams): Limits {
	let limits = {};

	if (imageRestriction !== 'none') {
		limits = {
			left: 0,
			top: 0,
			right: imageSize.width,
			bottom: imageSize.height,
		};
	}

	return limits;
}
