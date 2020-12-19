import {
	AspectRatio,
	PositionRestrictions,
	SizeRestrictions,
	Transform,
	Coordinates,
	Size,
	VisibleArea,
} from '../typings';
import { MoveEvent } from '../events';
import { approximatedSize } from './approximatedSize';
import { isUndefined } from '../utils';
import { move } from './move';

interface ApplyTransformParams {
	coordinates: Coordinates;
	transform: Transform | Transform[];
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
	imageSize: Size;
	visibleArea: VisibleArea;
	aspectRatio?: AspectRatio;
}

export function applyTransform(params: ApplyTransformParams) {
	const {
		coordinates: initialCoordinates,
		transform,
		imageSize,
		sizeRestrictions,
		positionRestrictions,
		aspectRatio,
		visibleArea,
	} = params;

	const moveAlgorithm = (prevCoordinates, newCoordinates) => {
		return move({
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
				sizeRestrictions,
				aspectRatio,
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
			changes = transform({ coordinates, imageSize, visibleArea });
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

	return coordinates;
}
