import {
	AreaRestrictions,
	Boundaries,
	ImageRestriction,
	PositionRestrictions,
	Size,
	SizeRestrictions,
	VisibleArea,
} from '../typings';
import { fitSize, limitsToSize } from '../service';
import { isUndefined } from '../utils';

interface RefineSizeRestrictionsParams {
	sizeRestrictions: Partial<SizeRestrictions>;
	areaRestrictions: AreaRestrictions;
	positionRestrictions: PositionRestrictions;
	boundaries: Boundaries;
	imageSize: Size;
	imageRestriction: ImageRestriction;
}
export function refineSizeRestrictions({
	areaRestrictions,
	sizeRestrictions,
	imageSize,
	boundaries,
	positionRestrictions,
	imageRestriction = 'none',
}: RefineSizeRestrictionsParams) {
	// User can forget to set some of restrictions, so we should init them by default values
	const restrictions = {
		...sizeRestrictions,
		minWidth: sizeRestrictions.minWidth !== undefined ? sizeRestrictions.minWidth : 0,
		minHeight: sizeRestrictions.minHeight !== undefined ? sizeRestrictions.minHeight : 0,
		maxWidth: sizeRestrictions.maxWidth !== undefined ? sizeRestrictions.maxWidth : Infinity,
		maxHeight: sizeRestrictions.maxHeight !== undefined ? sizeRestrictions.maxHeight : Infinity,
	};

	// The situation, when stencil can't be positioned in cropper due to positionRestrictions should be avoided
	if (positionRestrictions.left !== undefined && positionRestrictions.right !== undefined) {
		restrictions.maxWidth = Math.min(restrictions.maxWidth, positionRestrictions.right - positionRestrictions.left);
	}
	if (positionRestrictions.bottom !== undefined && positionRestrictions.top !== undefined) {
		restrictions.maxHeight = Math.min(
			restrictions.maxHeight,
			positionRestrictions.bottom - positionRestrictions.top,
		);
	}

	// The situation when stencil larger than maximum visible area or image should be avoided if imageRestriction != 'none':
	const areaLimits = limitsToSize(areaRestrictions);
	const areaMaximum = fitSize(boundaries, areaLimits);

	if (areaLimits.width < Infinity && (!restrictions.maxWidth || restrictions.maxWidth > areaMaximum.width)) {
		restrictions.maxWidth = Math.min(restrictions.maxWidth, areaMaximum.width);
	}
	if (areaLimits.height < Infinity && (!restrictions.maxHeight || restrictions.maxHeight > areaMaximum.height)) {
		restrictions.maxHeight = Math.min(restrictions.maxHeight, areaMaximum.height);
	}

	// Process the border cases when minimum height / width larger than maximum height / width
	if (restrictions.minWidth > restrictions.maxWidth) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(
				`Warning: maximum width (${restrictions.maxWidth}px) fewer that the minimum width (${restrictions.minWidth}px). It is set equal to the minimum width and width resizing was blocked`,
			);
		}
		restrictions.minWidth = restrictions.maxWidth;
		restrictions.widthFrozen = true;
	}

	if (restrictions.minHeight > restrictions.maxHeight) {
		if (process.env.NODE_ENV !== 'production') {
			console.warn(
				`Warning: maximum height (${restrictions.maxHeight}px) fewer that the minimum height (${restrictions.minHeight}px). It is set equal to the minimum height and height resizing was blocked`,
			);
		}
		restrictions.minHeight = restrictions.maxHeight;
		restrictions.heightFrozen = true;
	}

	return restrictions;
}
