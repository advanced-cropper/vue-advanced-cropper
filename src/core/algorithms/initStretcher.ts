import { Size } from '../typings';
import { ratio } from '../service';

export interface InitStretcherParams {
	stretcher: HTMLElement;
	imageSize: Size;
}
export function initStretcher({ stretcher, imageSize }: InitStretcherParams): void {
	const aspectRatio = ratio(imageSize);
	stretcher.style.width = `${imageSize.width}px`;
	stretcher.style.height = `${stretcher.clientWidth / aspectRatio}px`;
	// Prevent stretching in future until stretcher will be reinitialized
	stretcher.style.width = `${stretcher.clientWidth}px`;
}
