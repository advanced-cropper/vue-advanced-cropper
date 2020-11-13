import { ImageRestriction, Limits, Size } from '../typings';

export interface AreaRestrictionsParams {
	imageRestriction: ImageRestriction;
	imageSize: Size;
}
export function areaRestrictions(params: AreaRestrictionsParams): Limits {
	const { imageSize, imageRestriction } = params;

	let limits = {};

	if (imageRestriction === 'area') {
		limits = {
			left: 0,
			top: 0,
			right: imageSize.width,
			bottom: imageSize.height,
		};
	}

	return limits;
}
