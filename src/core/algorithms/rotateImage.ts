import {
	AspectRatio,
	Boundaries,
	Coordinates,
	CropperEvent,
	GetAreaRestrictions,
	ImageSize,
	PositionRestrictions,
	Size,
	SizeRestrictions,
	VisibleArea,
} from '../typings';
import { isApproximatelyEqual, sign } from '../utils';
import {
	adjustSize,
	applyMove,
	applyScale,
	diff,
	fitSize,
	fitToLimits,
	getCenter,
	intersectionLimits,
	ratio,
	rotatePoint,
	rotateSize,
	toLimits,
} from '../service';
import { approximatedSize } from './approximatedSize';

interface RotateImageParams {
	aspectRatio: AspectRatio;
	coordinates: Coordinates;
	visibleArea: VisibleArea;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
	getAreaRestrictions: GetAreaRestrictions;
	imageSize: ImageSize;
	previousImageSize: ImageSize;
	angle: number;
}

interface RotateImageResult {
	visibleArea: VisibleArea;
	coordinates: Coordinates;
}

export function rotateImage(params: RotateImageParams): RotateImageResult {
	const {
		aspectRatio,
		getAreaRestrictions,
		coordinates: originalCoordinates,
		visibleArea: originalVisibleArea,
		sizeRestrictions,
		positionRestrictions,
		imageSize,
		previousImageSize,
		angle,
	} = params;

	let coordinates = { ...originalCoordinates };
	let visibleArea = { ...originalVisibleArea };

	const imageCenter = rotatePoint(
		getCenter({
			left: 0,
			top: 0,
			...previousImageSize,
		}),
		angle,
	);

	coordinates = {
		...approximatedSize({
			sizeRestrictions,
			aspectRatio,
			width: coordinates.width,
			height: coordinates.height,
		}),
		...rotatePoint(getCenter(coordinates), angle),
	};

	coordinates.left -= imageCenter.left - imageSize.width / 2 + coordinates.width / 2;
	coordinates.top -= imageCenter.top - imageSize.height / 2 + coordinates.height / 2;

	// Check that visible area doesn't break the area restrictions:
	visibleArea = applyScale(
		visibleArea,
		adjustSize(visibleArea, getAreaRestrictions({ visibleArea, type: 'resize' })),
	);

	coordinates = fitToLimits(coordinates, positionRestrictions);

	visibleArea = applyMove(visibleArea, diff(getCenter(coordinates), getCenter(originalCoordinates)));

	visibleArea = fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));

	return {
		coordinates,
		visibleArea,
	};
}
