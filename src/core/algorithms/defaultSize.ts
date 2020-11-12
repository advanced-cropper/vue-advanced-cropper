import { AspectRatio, Boundaries, Falsy, ImageSize, Size, SizeRestrictions, VisibleArea } from '../typings';
import { approximatedSize } from './approximatedSize';
import { ratio } from '../service';

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

export type DefaultSizeParams = VisibleAreaDefaultSizeParams | ImageDefaultSizeParams

export function defaultSize({
	imageSize,
	visibleArea,
	boundaries,
	aspectRatio,
	sizeRestrictions,
}: DefaultSizeParams): Size {
	const area = (visibleArea || imageSize) as Size;

	const size =
		boundaries.width > boundaries.height
			? {
					width: area.width * 0.8,
					height: (area.width * 0.8) / ratio(boundaries),
			  }
			: {
					height: area.height * 0.8,
					width: area.height * 0.8 * ratio(boundaries),
			  };

	return approximatedSize({
		...size,
		aspectRatio,
		sizeRestrictions: sizeRestrictions,
	});
}
