import { AspectRatio, Size, SizeRestrictions, VisibleArea } from '../typings';
import { approximatedSize } from './approximatedSize';
import { limitSizeRestrictions } from '../service';

export interface DefaultSizeParams {
	visibleArea: VisibleArea;
	aspectRatio: AspectRatio;
	sizeRestrictions: SizeRestrictions;
}
export function defaultSize({ visibleArea, aspectRatio, sizeRestrictions }: DefaultSizeParams): Size {
	return approximatedSize({
		width: visibleArea.width * 0.8,
		height: visibleArea.height * 0.8,
		aspectRatio,
		sizeRestrictions: limitSizeRestrictions(sizeRestrictions, visibleArea),
	});
}
