// @ts-ignore

import {
	Coordinates,
	Point,
	Size,
	SizeRestrictions,
	AspectRatio,
	PositionRestrictions,
	VisibleArea,
	AreaRestrictions,
	Boundaries,
	ImageRestriction,
	ImageSize,
} from './typings';

import {
	DefaultPositionParams,
	DefaultSizeParams,
	approximatedSize,
	areaRestrictions,
	defaultPosition,
	defaultSize,
	defaultVisibleArea,
	fitCoordinates,
	limitBy,
	move,
	positionRestrictions,
	refineSizeRestrictions,
	resize,
	fitVisibleArea,
} from './algorithms';

import { fitToLimits, ratio } from './service';

import { MoveEvent, ResizeEvent } from './events';

interface RenderData {
	boundaries: Boundaries;
	visibleArea: VisibleArea;
	coordinates: Coordinates;
	imageSize: ImageSize;
}

interface CropperProps {
	boundaries: Boundaries;
	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;
	aspectRatio?: AspectRatio;
	imageRestriction?: ImageRestriction;
	render?: (data: RenderData) => void;
}

export function examine(cropper: Cropper) {
	const errors: string[] = [];
	if (cropper.coordinates.width > cropper.sizeRestrictions.maxWidth) {
		errors.push(`Width (${cropper.coordinates.width}) > Max Width (${cropper.sizeRestrictions.maxWidth})`);
	}
	if (cropper.coordinates.height > cropper.sizeRestrictions.maxHeight) {
		errors.push(`Width (${cropper.coordinates.height}) > Max Height (${cropper.sizeRestrictions.maxHeight})`);
	}
	if (cropper.coordinates.width > cropper.sizeRestrictions.minWidth) {
		errors.push(`Width (${cropper.coordinates.width}) < Min Width (${cropper.sizeRestrictions.minWidth})`);
	}
	if (cropper.coordinates.height > cropper.sizeRestrictions.minHeight) {
		errors.push(`Width (${cropper.coordinates.height}) < Min Height (${cropper.sizeRestrictions.minHeight})`);
	}
	if (ratio(cropper.coordinates) > cropper.aspectRatio.maximum) {
		errors.push(
			`${cropper.coordinates.width}/${cropper.coordinates.height} > Maximum Aspect Ratio (${cropper.aspectRatio.maximum})`,
		);
	}
	if (ratio(cropper.coordinates) < cropper.aspectRatio.minimum) {
		errors.push(
			`${cropper.coordinates.width}/${cropper.coordinates.height} < Minimum Aspect Ratio (${cropper.aspectRatio.minimum})`,
		);
	}
	if (
		cropper.positionRestrictions.left !== undefined &&
		cropper.coordinates.left < cropper.positionRestrictions.left
	) {
		errors.push(
			`Coordinates Left (${cropper.coordinates.left}) < Position Restrictions Left (${cropper.positionRestrictions.left})`,
		);
	}
	if (cropper.positionRestrictions.top !== undefined && cropper.coordinates.top < cropper.positionRestrictions.top) {
		errors.push(
			`Coordinates Top (${cropper.coordinates.top}) < Position Restrictions Top (${cropper.positionRestrictions.top})`,
		);
	}
	if (
		cropper.positionRestrictions.right !== undefined &&
		cropper.coordinates.left + cropper.coordinates.width > cropper.positionRestrictions.right
	) {
		errors.push(
			`Coordinates Right (${
				cropper.coordinates.left + cropper.coordinates.width
			}) > Position Restrictions Right (${cropper.positionRestrictions.right})`,
		);
	}
	if (
		cropper.positionRestrictions.bottom !== undefined &&
		cropper.coordinates.top + cropper.coordinates.height > cropper.positionRestrictions.bottom
	) {
		errors.push(
			`Coordinates Bottom (${
				cropper.coordinates.top + cropper.coordinates.height
			}) > Position Restrictions Bottom (${cropper.positionRestrictions.bottom})`,
		);
	}
	return errors;
}

export class Cropper {
	coordinates: Coordinates;
	visibleArea: VisibleArea | null;
	boundaries: Boundaries;
	areaRestrictions: AreaRestrictions;
	sizeRestrictions: SizeRestrictions;
	positionRestrictions: PositionRestrictions;
	imageSize: ImageSize;
	aspectRatio: AspectRatio;
	imageRestriction: ImageRestriction;
	minWidth?: number;
	minHeight?: number;
	maxWidth?: number;
	maxHeight?: number;

	defaultSize?: (params: DefaultSizeParams) => Size;
	defaultPosition?: (params: DefaultPositionParams) => Point;
	render?: (data: RenderData) => void;

	constructor({
		boundaries,
		aspectRatio,
		minWidth,
		minHeight,
		maxWidth,
		maxHeight,
		render,
		imageRestriction,
	}: CropperProps) {
		this.boundaries = boundaries;
		this.minWidth = minWidth || 0;
		this.minHeight = minHeight || 0;
		this.maxWidth = maxWidth || Infinity;
		this.maxHeight = maxHeight || Infinity;
		this.render = render;
		this.aspectRatio = aspectRatio || {};
		this.imageRestriction = imageRestriction || 'none';
		this.visibleArea = null;
	}

	public setImage(image: ImageSize) {
		this.$setImage(image);
	}

	public resetCoordinates() {
		const size = approximatedSize({
			...(this.defaultSize || defaultSize)({
				aspectRatio: this.aspectRatio,
				sizeRestrictions: this.sizeRestrictions,
				visibleArea: this.visibleArea,
			}),
			aspectRatio: this.aspectRatio,
			sizeRestrictions: this.sizeRestrictions,
		});
		const position = (this.defaultPosition || defaultPosition)({
			coordinates: size,
			visibleArea: this.visibleArea,
			imageSize: this.imageSize
		});
		this.$setCoordinates({
			...size,
			...position,
		});
	}

	public setCoordinates(coordinates: Partial<Coordinates>) {
		this.$setCoordinates({
			left: coordinates.left || this.coordinates.left,
			top: coordinates.top || this.coordinates.top,
			width: coordinates.width || this.coordinates.width,
			height: coordinates.height || this.coordinates.height,
		});
	}

	public move(event: MoveEvent) {
		this.setCoordinates(
			move({
				coordinates: this.coordinates,
				positionRestrictions: limitBy(this.positionRestrictions, this.visibleArea),
				event,
			}),
		);
	}

	public resize(event: ResizeEvent) {
		this.setCoordinates(
			resize({
				coordinates: this.coordinates,
				positionRestrictions: limitBy(this.positionRestrictions, this.visibleArea),
				sizeRestrictions: this.sizeRestrictions,
				aspectRatio: this.aspectRatio,
				event,
			}),
		);
	}

	public refresh(boundaries?: Boundaries) {
		this.boundaries = boundaries || this.boundaries;
		this.$setVisibleArea(
			this.visibleArea
				? fitVisibleArea({
						areaRestrictions: this.areaRestrictions,
						visibleArea: this.visibleArea,
						coordinates: this.coordinates,
						boundaries: this.boundaries,
				  })
				: defaultVisibleArea({
						boundaries: this.boundaries,
						imageSize: this.imageSize,
						areaRestrictions: this.areaRestrictions
				  }),
		);

		this.$setCoordinates(
			fitCoordinates({
				aspectRatio: this.aspectRatio,
				coordinates: this.coordinates,
				positionRestrictions: this.positionRestrictions,
				sizeRestrictions: this.sizeRestrictions,
				visibleArea: this.visibleArea,
			}),
		);
	}

	private $render() {
		if (this.render) {
			this.render({
				boundaries: this.boundaries,
				coordinates: this.coordinates,
				visibleArea: this.visibleArea,
				imageSize: this.imageSize,
			});
		}
	}

	private $recalculateSizeRestrictions() {
		this.sizeRestrictions = refineSizeRestrictions({
			boundaries: this.boundaries,
			imageRestriction: this.imageRestriction,
			imageSize: this.imageSize,
			positionRestrictions: this.positionRestrictions,
			sizeRestrictions: {
				minWidth: this.minWidth,
				minHeight: this.minHeight,
				maxWidth: this.maxWidth,
				maxHeight: this.maxHeight,
			},
		});
	}

	private $recalculatePositionRestrictions() {
		this.positionRestrictions = positionRestrictions({
			imageRestriction: this.imageRestriction,
			imageSize: this.imageSize,
		});
	}
	private $recalculateAreaRestrictions() {
		this.areaRestrictions = areaRestrictions({
			imageRestriction: this.imageRestriction,
			imageSize: this.imageSize,
		});
	}

	private $setImage(imageSize: ImageSize) {
		this.imageSize = imageSize;
		this.visibleArea = null;
		this.$recalculatePositionRestrictions();
		this.$recalculateAreaRestrictions();
		this.refresh();
		this.resetCoordinates();
	}

	private $setVisibleArea(visibleArea: VisibleArea) {
		this.visibleArea = visibleArea;
		this.$recalculateSizeRestrictions();
		this.$render();
	}

	private $setCoordinates(coordinates: Coordinates) {
		this.coordinates = fitToLimits(
			{
				...coordinates,
				...approximatedSize({
					...coordinates,
					aspectRatio: this.aspectRatio,
					sizeRestrictions: this.sizeRestrictions,
				}),
			},
			this.positionRestrictions,
		);
		this.$render();
	}
}
