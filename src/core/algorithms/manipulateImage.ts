import { ManipulateImageEvent } from '../events';
import { GetAreaRestrictions, Coordinates, PositionRestrictions, SizeRestrictions, VisibleArea } from '../typings';
import {
	applyMove,
	applyScale,
	fit,
	fitToLimits,
	getCenter,
	intersectionLimits,
	inverseMove,
	maxScale,
	toLimits,
} from '../service';

interface ManipulateImageParams {
	event: ManipulateImageEvent;
	coordinates: Coordinates;
	visibleArea: VisibleArea;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
	getAreaRestrictions: GetAreaRestrictions;
	adjustStencil: boolean;
}
interface ManipulateImageResult {
	visibleArea: VisibleArea;
	coordinates: Coordinates;
}
export function manipulateImage(params: ManipulateImageParams): ManipulateImageResult {
	const {
		event,
		coordinates: originalCoordinates,
		visibleArea: originalVisibleArea,
		sizeRestrictions,
		getAreaRestrictions,
		positionRestrictions,
		adjustStencil,
	} = params;

	const { scale, move } = event;

	let visibleArea = { ...originalVisibleArea };
	let coordinates = { ...originalCoordinates };

	let areaScale = 1;
	let stencilScale = 1;
	const allowedScale = scale.factor && Math.abs(scale.factor - 1) > 1e-3;

	visibleArea = applyMove(visibleArea, {
		left: move.left || 0,
		top: move.top || 0,
	});

	const scaleRestrictions = {
		stencil: {
			minimum: Math.max(
				sizeRestrictions.minWidth ? sizeRestrictions.minWidth / coordinates.width : 0,
				sizeRestrictions.minHeight ? sizeRestrictions.minHeight / coordinates.height : 0,
			),
			maximum: Math.min(
				sizeRestrictions.maxWidth ? sizeRestrictions.maxWidth / coordinates.width : Infinity,
				sizeRestrictions.maxHeight ? sizeRestrictions.maxHeight / coordinates.height : Infinity,
				maxScale(coordinates, positionRestrictions),
			),
		},
		area: {
			maximum: maxScale(visibleArea, getAreaRestrictions({ visibleArea, type: 'resize' })),
		},
	};

	// If there is scaling then begin scale
	if (scale.factor && allowedScale) {
		// Determine scale factor
		if (scale.factor < 1) {
			stencilScale = Math.max(scale.factor, scaleRestrictions.stencil.minimum);
			if (stencilScale > 1) {
				stencilScale = 1;
			}
		} else if (scale.factor > 1) {
			stencilScale = Math.min(
				scale.factor,
				Math.min(scaleRestrictions.area.maximum, scaleRestrictions.stencil.maximum),
			);
			if (stencilScale < 1) {
				stencilScale = 1;
			}
		}
	}

	if (stencilScale) {
		// Resize stencil with area as much is possible
		visibleArea = applyScale(visibleArea, stencilScale, scale.center);
	}

	const relativeCoordinates = {
		left: originalCoordinates.left - originalVisibleArea.left,
		right:
			originalVisibleArea.width +
			originalVisibleArea.left -
			(originalCoordinates.width + originalCoordinates.left),
		top: originalCoordinates.top - originalVisibleArea.top,
		bottom:
			originalVisibleArea.height +
			originalVisibleArea.top -
			(originalCoordinates.height + originalCoordinates.top),
	};

	// Move the area to fit to coordinates limits:
	visibleArea = applyMove(
		visibleArea,
		fit(visibleArea, {
			left:
				positionRestrictions.left !== undefined
					? positionRestrictions.left - relativeCoordinates.left * stencilScale
					: undefined,
			top:
				positionRestrictions.top !== undefined
					? positionRestrictions.top - relativeCoordinates.top * stencilScale
					: undefined,
			bottom:
				positionRestrictions.bottom !== undefined
					? positionRestrictions.bottom + relativeCoordinates.bottom * stencilScale
					: undefined,
			right:
				positionRestrictions.right !== undefined
					? positionRestrictions.right + relativeCoordinates.right * stencilScale
					: undefined,
		}),
	);

	// But the more important to fit are to the area restrictions, so we should fit it to that restrictions:
	visibleArea = fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));

	// Set the same coordinates of stencil inside visible area
	coordinates.width = coordinates.width * stencilScale;
	coordinates.height = coordinates.height * stencilScale;
	coordinates.left = visibleArea.left + relativeCoordinates.left * stencilScale;
	coordinates.top = visibleArea.top + relativeCoordinates.top * stencilScale;

	// Move the coordinates to prevent the intersection with visible area and position restrictions
	coordinates = fitToLimits(coordinates, intersectionLimits(toLimits(visibleArea), positionRestrictions));

	// Resize only area if stencil can't be resized and stencil resize is disabled
	if (scale.factor && allowedScale && adjustStencil) {
		if (scale.factor > 1) {
			areaScale = Math.min(scaleRestrictions.area.maximum, scale.factor) / stencilScale;
		} else if (scale.factor < 1) {
			areaScale = Math.max(
				coordinates.height / visibleArea.height,
				coordinates.width / visibleArea.width,
				scale.factor / stencilScale,
			);
		}
		if (areaScale !== 1) {
			visibleArea = applyScale(visibleArea, areaScale, scale.factor > 1 ? scale.center : getCenter(coordinates));

			// Move to prevent the breaking of the area restrictions:
			visibleArea = fitToLimits(visibleArea, getAreaRestrictions({ visibleArea, type: 'move' }));

			// Move to prevent the intersection with coordinates:
			visibleArea = applyMove(visibleArea, inverseMove(fit(coordinates, toLimits(visibleArea))));
		}
	}

	return {
		coordinates,
		visibleArea,
	};
}
