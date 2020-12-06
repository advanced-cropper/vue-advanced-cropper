import { Boundaries, ImageRestriction, Limits, Size, VisibleArea } from '../typings';
import { ratio } from '../service';

export interface DynamicAreaRestrictionsParams {
	imageRestriction: ImageRestriction;
	imageSize: Size;
	boundaries: Boundaries;
	visibleArea?: VisibleArea;
	center?: boolean;
	type: 'resize' | 'move';
}
export function dynamicAreaRestrictions(params: DynamicAreaRestrictionsParams): Limits {
	const { visibleArea, boundaries, imageSize, imageRestriction, type } = params;

	let limits: Limits = {};

	if (imageRestriction === 'fill-area') {
		limits = {
			left: 0,
			top: 0,
			right: imageSize.width,
			bottom: imageSize.height,
		};
	} else if (imageRestriction === 'fit-area') {
		if (ratio(boundaries) > ratio(imageSize)) {
			limits = {
				top: 0,
				bottom: imageSize.height,
			};
			if (visibleArea && type === 'move') {
				if (visibleArea.width > imageSize.width) {
					limits.left = -(visibleArea.width - imageSize.width) / 2;
					limits.right = imageSize.width - limits.left;
				} else {
					limits.left = 0;
					limits.right = imageSize.width;
				}
			}
		} else {
			limits = {
				left: 0,
				right: imageSize.width,
			};
			if (visibleArea && type === 'move') {
				if (visibleArea.height > imageSize.height) {
					limits.top = -(visibleArea.height - imageSize.height) / 2;
					limits.bottom = imageSize.height - limits.top;
				} else {
					limits.top = 0;
					limits.bottom = imageSize.height;
				}
			}
		}
	}

	return limits;
}
