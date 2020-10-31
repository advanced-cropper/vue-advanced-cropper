import { AspectRatio, Size, SizeRestrictions, VisibleArea } from "../typings";
import { approximatedSize } from "./approximatedSize";

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
		sizeRestrictions: {
			...sizeRestrictions,
			maxWidth: Math.min(visibleArea.width, sizeRestrictions.maxWidth),
			maxHeight: Math.min(visibleArea.height, sizeRestrictions.maxHeight),
		},
	});
}
