import {
	adjustSize,
	applyMove,
	applyScale,
	diff,
	fit,
	fitToLimits,
	getCenter,
	intersectionLimits,
	inverseMove,
	maxScale,
	ratio,
	toLimits,
} from '../service';
import {
	AspectRatio,
	Boundaries,
	Coordinates,
	CropperEvent,
	GetAreaRestrictions,
	PositionRestrictions,
	Size,
	SizeRestrictions,
	VisibleArea,
} from '../typings';
import { isApproximatelyEqual } from '../utils';
import { approximatedSize } from './approximatedSize';
import { ALL_DIRECTIONS } from '../constants';
import apply = Reflect.apply;

interface AutoZoomResult {
	visibleArea: VisibleArea;
	coordinates: Coordinates;
}

interface AutoZoomParams {
	event: CropperEvent;
	coordinates: Coordinates;
	stencilReference: Coordinates;
	visibleArea: VisibleArea;
	boundaries: Boundaries;
	aspectRatio: AspectRatio;
	stencilSize: Size;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
	getAreaRestrictions: GetAreaRestrictions;
}

export function autoZoom(params: AutoZoomParams): AutoZoomResult {
	const {
		event,
		coordinates,
		visibleArea,
		boundaries,
		aspectRatio,
		stencilReference,
		stencilSize,
		sizeRestrictions,
		positionRestrictions,
		getAreaRestrictions,
	} = params;

	if (stencilSize) {
		return fixedStencilAutoZoom(params);
	} else {
		return simplestAutoZoom({
			event,
			coordinates,
			visibleArea,
			getAreaRestrictions,
		});
	}
}

export function fixedStencilAutoZoom(params: AutoZoomParams): AutoZoomResult {
	const {
		event,
		getAreaRestrictions,
		boundaries,
		coordinates: originalCoordinates,
		visibleArea: originalVisibleArea,
		aspectRatio,
		stencilSize,
		sizeRestrictions,
		positionRestrictions,
		stencilReference,
	} = params;

	let coordinates = { ...originalCoordinates };
	let visibleArea = { ...originalVisibleArea };

	// Checks that coordinates has the same ratio that coordinates:
	let stencil = { ...stencilSize };

	if (!isApproximatelyEqual(ratio(stencil), ratio(coordinates))) {
		if (process.env.NODE_ENV !== 'production') {
			console.error(
				`[Adjusting stencil] The aspect ratio of coordinates is not equal to the aspect ratio of stencil (${ratio(
					coordinates,
				)} != ${ratio(stencil)})! Coordinates will be changed`,
			);
		}
		coordinates = {
			...coordinates,
			...approximatedSize({
				sizeRestrictions,
				width: coordinates.width,
				height: coordinates.height,
				aspectRatio: {
					minimum: ratio(stencil),
					maximum: ratio(stencil),
				},
			}),
		};
	}

	// First of all try to resize visible area as much as possible:
	visibleArea = applyScale(visibleArea, (coordinates.width * boundaries.width) / (visibleArea.width * stencil.width));

	// Check that visible area doesn't break the area restrictions:
	const scale = adjustSize(visibleArea, getAreaRestrictions({ visibleArea, type: 'resize' }));
	if (scale !== 1) {
		visibleArea = applyScale(visibleArea, scale);
		coordinates = applyScale(coordinates, scale);
	}

	visibleArea = applyMove(visibleArea, diff(getCenter(coordinates), getCenter(visibleArea)));

	// Center stencil in visible area:
	visibleArea = fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));
	coordinates = fitToLimits(coordinates, intersectionLimits(toLimits(visibleArea), positionRestrictions));

	return {
		coordinates,
		visibleArea,
	};
}

export function hybridStencilAutoZoom(params: AutoZoomParams): AutoZoomResult {
	const {
		event,
		getAreaRestrictions,
		boundaries,
		coordinates: originalCoordinates,
		visibleArea: originalVisibleArea,
		aspectRatio,
		stencilSize,
		sizeRestrictions,
		positionRestrictions,
		stencilReference,
	} = params;

	let coordinates = { ...originalCoordinates };
	let visibleArea = { ...originalVisibleArea };

	if (originalCoordinates && originalVisibleArea) {
		// Checks that coordinates has the same ratio that coordinates:
		let stencil: Size = {
			width: 0,
			height: 0,
		};

		const coefficient = visibleArea.width / boundaries.width;

		if (ratio(boundaries) > ratio(coordinates)) {
			stencil.height = Math.max(coordinates.height / coefficient, boundaries.height * 0.8);
			stencil.width = stencil.height * ratio(coordinates);
		} else {
			stencil.width = Math.max(coordinates.width / coefficient, boundaries.width * 0.8);
			stencil.height = stencil.width * ratio(coordinates);
		}

		// First of all try to resize visible area as much as possible:
		visibleArea = applyScale(
			visibleArea,
			(coordinates.width * boundaries.width) / (visibleArea.width * stencil.width),
		);

		// Check that visible area doesn't break the area restrictions:
		visibleArea = applyScale(
			visibleArea,
			adjustSize(visibleArea, getAreaRestrictions({ visibleArea, type: 'resize' })),
		);

		visibleArea = applyMove(visibleArea, diff(getCenter(coordinates), getCenter(visibleArea)));

		// Center stencil in visible area:
		visibleArea = fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));
		coordinates = fitToLimits(coordinates, intersectionLimits(toLimits(visibleArea), positionRestrictions));
	}

	return {
		coordinates,
		visibleArea,
	};
}

// The main point of this feature is calculating the needed position of stencil and parameters of world transforms
// Real coordinates don't changes here
interface SimplestAutoZoomParams {
	event: CropperEvent;
	coordinates: Coordinates;
	visibleArea: VisibleArea;
	getAreaRestrictions: GetAreaRestrictions;
}
export function simplestAutoZoom(params: SimplestAutoZoomParams): AutoZoomResult {
	const { event, coordinates: originalCoordinates, visibleArea: originalVisibleArea, getAreaRestrictions } = params;

	let visibleArea = { ...originalVisibleArea };
	const coordinates = { ...originalCoordinates };

	if (event === 'setCoordinates') {
		const widthIntersections = Math.max(0, coordinates.width - visibleArea.width);
		const heightIntersections = Math.max(0, coordinates.height - visibleArea.height);

		if (widthIntersections > heightIntersections) {
			visibleArea = applyScale(
				visibleArea,
				Math.min(
					coordinates.width / visibleArea.width,
					maxScale(visibleArea, getAreaRestrictions({ visibleArea, type: 'resize' })),
				),
			);
		} else if (heightIntersections > widthIntersections) {
			visibleArea = applyScale(
				visibleArea,
				Math.min(
					coordinates.height / visibleArea.height,
					maxScale(visibleArea, getAreaRestrictions({ visibleArea, type: 'resize' })),
				),
			);
		}

		visibleArea = applyMove(visibleArea, inverseMove(fit(coordinates, toLimits(visibleArea))));

		visibleArea = fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));
	}
	return {
		visibleArea,
		coordinates,
	};
}
