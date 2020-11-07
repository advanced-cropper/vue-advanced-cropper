import { Boundaries, Size } from '../typings';

interface DefaultBoundariesParams {
	cropper: HTMLElement;
	imageSize: Size;
}
export function defaultBoundaries({ cropper, imageSize }: DefaultBoundariesParams): Boundaries {
	const areaHeight = cropper.clientHeight;
	const areaWidth = cropper.clientWidth;

	let currentHeight = areaHeight;
	let currentWidth = (imageSize.width * areaHeight) / imageSize.height;

	if (currentWidth > areaWidth) {
		currentWidth = areaWidth;
		currentHeight = (imageSize.height * areaWidth) / imageSize.width;
	}

	return {
		width: currentWidth,
		height: currentHeight,
	};
}
