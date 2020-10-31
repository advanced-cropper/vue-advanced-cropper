import { Size, SizeRestrictions } from "../typings";

interface PercentRestrictionParams {
	imageSize: Size;
	minWidth: number;
	minHeight: number;
	maxWidth: number;
	maxHeight: number;
}
export function percentRestrictions({
  imageSize,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
}: PercentRestrictionParams): SizeRestrictions {
	return {
		minWidth: (minWidth / 100) * imageSize.width,
		minHeight: (minHeight / 100) * imageSize.height,
		maxWidth: (maxWidth / 100) * imageSize.width,
		maxHeight: (maxHeight / 100) * imageSize.height,
	};
}
