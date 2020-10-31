import { Size } from "../typings";
import { ratio } from "../service";

interface InitStretcherParams {
	stretcher: HTMLElement;
	imageSize: Size;
}
export function initStretcher({ stretcher, imageSize }: InitStretcherParams): void {
	const aspectRatio = ratio(imageSize);

	if (imageSize.height > imageSize.width) {
		stretcher.style.height = `${imageSize.height}px`;
		stretcher.style.width = `${stretcher.clientHeight * aspectRatio}px`;
		if (stretcher.clientWidth / stretcher.clientHeight !== aspectRatio) {
			stretcher.style.height = `${stretcher.clientWidth / aspectRatio}px`;
		}
	} else {
		stretcher.style.width = `${imageSize.width}px`;
		stretcher.style.height = `${stretcher.clientWidth / aspectRatio}px`;
		if (stretcher.clientHeight / stretcher.clientWidth !== aspectRatio) {
			stretcher.style.width = `${stretcher.clientHeight * aspectRatio}px`;
		}
	}
}
