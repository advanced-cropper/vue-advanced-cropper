import { Coordinates, Size } from './typings';

interface Options {
	imageSmoothingQuality?: 'low' | 'medium' | 'high';
	imageSmoothingEnabled?: boolean;
	fillColor?: string;
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

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (options) {
		if (options.imageSmoothingEnabled) {
			ctx.imageSmoothingEnabled = options.imageSmoothingEnabled;
		}
		if (options.imageSmoothingQuality) {
			ctx.imageSmoothingQuality = options.imageSmoothingQuality;
		}
		if (options.fillColor) {
			ctx.fillStyle = options.fillColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.save();
		}
	}

	const offsetX = coordinates.left < 0 ? -coordinates.left : 0;
	const offsetY = coordinates.top < 0 ? -coordinates.top : 0;

	ctx.drawImage(
		source,
		coordinates.left + offsetX,
		coordinates.top + offsetY,
		coordinates.width,
		coordinates.height,
		offsetX,
		offsetY,
		canvas.width,
		canvas.height,
	);
}
