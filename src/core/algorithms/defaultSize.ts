import { AspectRatio, Boundaries, ImageSize, Size, SizeRestrictions, VisibleArea } from '../typings';
import { approximatedSize } from './approximatedSize';
import { ratio } from '../service';

export interface DefaultSizeParams {
	imageSize?: ImageSize;
	aspectRatio: AspectRatio;
	boundaries?: Boundaries;
	visibleArea?: VisibleArea;
	sizeRestrictions: SizeRestrictions;
}
export function defaultSize({
	imageSize,
	visibleArea,
	boundaries,
	aspectRatio,
	sizeRestrictions,
}: DefaultSizeParams): Size {
	const area = visibleArea || imageSize;

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
