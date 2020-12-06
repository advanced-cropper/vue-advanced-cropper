import { Coordinates } from './typings';

export function updateCanvas(
	canvas: HTMLCanvasElement,
	source: HTMLCanvasElement | HTMLImageElement,
	coordinates: Coordinates,
	resultCoordinates?: Coordinates,
) {
	canvas.width = resultCoordinates ? resultCoordinates.width : coordinates.width;
	canvas.height = resultCoordinates ? resultCoordinates.height : coordinates.height;

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
		canvas.width,
		canvas.height,
	);
}
