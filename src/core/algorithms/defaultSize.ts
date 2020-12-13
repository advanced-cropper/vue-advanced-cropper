import {
	AspectRatio,
	Boundaries,
	Falsy,
	ImageSize,
	Size,
	SizeRestrictions,
	StencilSize,
	VisibleArea,
} from '../typings';
import { approximatedSize } from './approximatedSize';
import { ratio } from '../service';
import { isNumber } from '../utils';

interface DefaultSizeBasicParams {
	aspectRatio: AspectRatio;
	boundaries: Boundaries;
	sizeRestrictions: SizeRestrictions;
}

interface ImageDefaultSizeParams extends DefaultSizeBasicParams {
	imageSize: ImageSize;
	visibleArea?: VisibleArea | Falsy;
}

interface VisibleAreaDefaultSizeParams extends DefaultSizeBasicParams {
	imageSize?: ImageSize | Falsy;
	visibleArea: VisibleArea;
}

export type DefaultSizeParams = VisibleAreaDefaultSizeParams | ImageDefaultSizeParams;

export function defaultSize(params: DefaultSizeParams): Size {
	const { imageSize, visibleArea, aspectRatio, sizeRestrictions } = params;

	const area = (visibleArea || imageSize) as Size;

	const optimalRatio = Math.min(aspectRatio.maximum || Infinity, Math.max(aspectRatio.minimum || 0, ratio(area)));

	const size =
		area.width < area.height
			? {
					width: area.width * 0.8,
					height: (area.width * 0.8) / optimalRatio,
			  }
			: {
					height: area.height * 0.8,
					width: area.height * 0.8 * optimalRatio,
			  };

	return approximatedSize({
		...size,
		aspectRatio,
		sizeRestrictions: sizeRestrictions,
	});
}

export type FixedDefaultSizeParams = DefaultSizeParams & { stencilSize: Size };

export function fixedDefaultSize(params: FixedDefaultSizeParams): Size {
	const { imageSize, visibleArea, boundaries, aspectRatio, sizeRestrictions, stencilSize } = params;

	const area = (visibleArea || imageSize) as Size;

	let height, width;
	if (ratio(area) > ratio(boundaries)) {
		height = (stencilSize.height * area.height) / boundaries.height;
		width = height * ratio(stencilSize);
	} else {
		width = (stencilSize.width * area.width) / boundaries.width;
		height = width / ratio(stencilSize);
	}

	return approximatedSize({
		width,
		height,
		aspectRatio,
		sizeRestrictions: sizeRestrictions,
	});
}
