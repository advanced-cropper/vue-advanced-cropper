import { ImageRestriction, Limits, Size } from "../typings";

interface AreaRestrictionsParams {
	imageRestriction: ImageRestriction;
	imageSize: Size;
}
export function areaRestrictions({ imageSize, imageRestriction }: AreaRestrictionsParams): Limits {
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
