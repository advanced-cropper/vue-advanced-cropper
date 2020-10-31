import { AspectRatio, PositionRestrictions, SizeRestrictions, Transform, Coordinates } from '../typings';
import { MoveEvent } from '../events';
import { approximatedSize } from './approximatedSize';
import { isUndefined } from '../utils';

interface ApplyTransformParams {
	coordinates: Coordinates;
	transform: Transform | Transform[];
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
	aspectRatio?: AspectRatio;
}

export function applyTransform(params: ApplyTransformParams) {
	const { coordinates: initialCoordinates, transform, sizeRestrictions, positionRestrictions, aspectRatio } = params;

	const moveAlgorithm = (prevCoordinates, newCoordinates) => {
		return this.moveAlgorithm({
			coordinates: prevCoordinates,
			positionRestrictions,
			event: new MoveEvent({
				left: newCoordinates.left - prevCoordinates.left,
				top: newCoordinates.top - prevCoordinates.top,
			}),
		});
	};

	const resizeAlgorithm = (prevCoordinates, newCoordinates) => {
		let coordinates = {
			...prevCoordinates,
			...approximatedSize({
				width: newCoordinates.width,
				height: newCoordinates.height,
				sizeRestrictions: sizeRestrictions,
				aspectRatio: aspectRatio,
			}),
			left: 0,
			top: 0,
		};

		return moveAlgorithm(coordinates, {
			left: prevCoordinates.left,
			top: prevCoordinates.top,
		});
	};

	let coordinates = { ...initialCoordinates };

	const transforms = Array.isArray(transform) ? transform : [transform];

	transforms.forEach((transform) => {
		let changes: Partial<Coordinates> = {};
		if (typeof transform === 'function') {
			changes = transform({ ...coordinates }, this.imageSize);
		} else {
			changes = transform;
		}

		if (!isUndefined(changes.width) || !isUndefined(changes.height)) {
			coordinates = resizeAlgorithm(coordinates, { ...coordinates, ...changes });
		}
		if (!isUndefined(changes.left) || !isUndefined(changes.top)) {
			coordinates = moveAlgorithm(coordinates, { ...coordinates, ...changes });
		}
	});


}
