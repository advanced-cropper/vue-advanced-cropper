import { Boundaries, ImageRestriction, PositionRestrictions, Size, SizeRestrictions, VisibleArea } from '../typings';
import { fitSize } from '../service';

interface RefineSizeRestrictionsParams {
	sizeRestrictions: Partial<SizeRestrictions>;
	positionRestrictions: PositionRestrictions;
	boundaries: Boundaries;
	imageSize: Size;
	imageRestriction: ImageRestriction;
}
export function refineSizeRestrictions({
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
	if (imageRestriction !== 'none') {
		const areaMaximum = fitSize(boundaries, imageSize);
		const maxWidth = imageRestriction !== 'stencil' ? areaMaximum.width : imageSize.width;
		const maxHeight = imageRestriction !== 'stencil' ? areaMaximum.height : imageSize.height;
		if (!restrictions.maxWidth || restrictions.maxWidth > maxWidth) {
			restrictions.maxWidth = maxWidth;
		}
		if (!restrictions.maxHeight || restrictions.maxHeight > maxHeight) {
			restrictions.maxHeight = maxHeight;
		}
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
