import { Coordinates } from './typings';

export function updateCanvas(
	canvas: HTMLCanvasElement,
	source: HTMLCanvasElement | HTMLImageElement,
	coordinates: Coordinates,
) {
	canvas.width = coordinates.width;
	canvas.height = coordinates.height;

	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(
		source,
		coordinates.left,
		coordinates.top,
		coordinates.width,
		coordinates.height,
		0,
		0,
		coordinates.width,
		coordinates.height,
	);
}
