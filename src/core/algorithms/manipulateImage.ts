import { ManipulateImageEvent } from "../events";
import { AreaRestrictions, Coordinates, PositionRestrictions, SizeRestrictions, VisibleArea } from "../typings";
import { applyMove, applyScale, fit, getCenter, maxScale } from "../service";

interface ManipulateImageParams {
	event: ManipulateImageEvent;
	coordinates: Coordinates;
	visibleArea: VisibleArea;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
	areaRestrictions: AreaRestrictions;
	settings: {
		stencil?: boolean;
	};
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
		areaRestrictions,
		positionRestrictions,
		settings = {},
	} = params;

	const { scale, move } = event;

	let visibleArea = { ...originalVisibleArea };
	const coordinates = { ...originalCoordinates };

	let areaScale = 1;
	let stencilScale = 1;
	const allowedScale = scale.factor && Math.abs(scale.factor - 1) > 1e-3

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
			maximum: maxScale(visibleArea, areaRestrictions),
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

	// Move the area to fit to area limits:
	visibleArea = applyMove(visibleArea, fit(visibleArea, areaRestrictions));

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

	// Set the same coordinates of stencil inside visible area
	coordinates.width = coordinates.width * stencilScale;
	coordinates.height = coordinates.height * stencilScale;
	coordinates.left = visibleArea.left + relativeCoordinates.left * stencilScale;
	coordinates.top = visibleArea.top + relativeCoordinates.top * stencilScale;

	// Resize only area if stencil can't be resized and stencil resize is disabled
	if (scale.factor && allowedScale && settings.stencil) {
		if (scale.factor > 1) {
			areaScale = Math.min(scaleRestrictions.area.maximum, scale.factor) / stencilScale;
		} else if (scale.factor < 1) {
			areaScale = Math.max(coordinates.height / visibleArea.height, scale.factor) / stencilScale;
		}
		visibleArea = applyScale(
			visibleArea,
			areaScale,
			getCenter(coordinates),
			Math.pow(scale.factor > 1 ? scaleRestrictions.area.maximum : coordinates.height / visibleArea.height, 2),
		);
		visibleArea = applyMove(visibleArea, fit(visibleArea, areaRestrictions));
	}

	return {
		coordinates,
		visibleArea,
	};
}
