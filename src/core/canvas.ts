import { Coordinates, Size } from './typings';

interface Options {
	imageSmoothingQuality?: 'low' | 'medium' | 'high';
	imageSmoothingEnabled?: boolean;
}

export function updateCanvas(
	canvas: HTMLCanvasElement,
	source: HTMLCanvasElement | HTMLImageElement,
	coordinates: Coordinates,
	resultSize?: Size,
	options?: Options,
) {
	canvas.width = resultSize ? resultSize.width : coordinates.width;
	canvas.height = resultSize ? resultSize.height : coordinates.height;

	const ctx = canvas.getContext('2d');
	if (options) {
		if (options.imageSmoothingEnabled) {
			ctx.imageSmoothingEnabled = options.imageSmoothingEnabled;
		}
		if (options.imageSmoothingQuality) {
			ctx.imageSmoothingQuality = options.imageSmoothingQuality;
		}
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(
		source,
		coordinates.left,
		coordinates.top,
		coordinates.width,
		coordinates.height,
		0,
		0,
		canvas.width,
		canvas.height,
	);
}
