import Vue from 'vue';

declare class ManipulateImageEvent implements StencilEvent {
	type: 'manipulateImage';
	nativeEvent: Event;
	move: Partial<MoveDirections>;
	scale: Partial<Scale>;
	constructor(move: Partial<MoveDirections>, scale: Partial<Scale>);
}

export interface ResizeEventParams {
	compensate?: boolean;
	preserveRatio?: boolean;
	allowedDirections?: ResizeDirections;
	respectDirection?: 'width' | 'height';
}

declare class ResizeEvent implements StencilEvent {
	type: 'resize';
	directions: ResizeDirections;
	params: ResizeEventParams;

	constructor(directions: ResizeDirections, params: ResizeEventParams);
}

declare class MoveEvent implements StencilEvent {
	type: 'move';
	directions: MoveDirections;

	constructor(directions: MoveDirections);
}

declare class DragEvent implements StencilEvent {
	type: 'drag';
	nativeEvent: Event;
	position: Point;
	previousPosition: Point;
	anchor: Point;
	element: HTMLElement;

	constructor(nativeEvent: Event, element: HTMLElement, position: Point, previousPosition: Point, anchor: Point);

	public shift(): Diff;
}

export interface Coordinates {
	width: number;
	height: number;
	top: number;
	left: number;
}

export type VisibleArea = Coordinates;

export interface Limits {
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
}

export interface SizeRestrictions {
	minWidth: number;
	maxWidth: number;
	minHeight: number;
	maxHeight: number;
	widthFrozen?: boolean;
	heightFrozen?: boolean;
}

export interface ResizeDirections {
	top: number;
	left: number;
	right: number;
	bottom: number;
}

export interface MoveDirections {
	top: number;
	left: number;
}

export interface Point {
	top: number;
	left: number;
}

export interface Size {
	width: number;
	height: number;
}
export type ImageSize = Size;
export type Boundaries = Size;

export interface Intersections {
	left: number;
	top: number;
	bottom: number;
	right: number;
}

export interface AspectRatio {
	minimum?: number;
	maximum?: number;
}

export interface StencilEvent {
	type: EventType;
}

export type EventType = 'resize' | 'move' | 'drag' | 'manipulateImage';

export interface Diff {
	left: number;
	top: number;
}

export interface TransformParams {
	coordinates: Coordinates;
	imageSize: ImageSize;
	visibleArea: VisibleArea;
}

export type Transform = ((params: TransformParams) => Partial<Coordinates>) | Partial<Coordinates>;

export interface Scale {
	factor: number;
	center: Point;
}

export interface ImageTransforms {
	rotate: number;
	flip: {
		horizontal: boolean;
		vertical: boolean;
	};
}

export declare class Cropper extends Vue {
	getResult: () => {
		coordinates: Coordinates;
		visibleArea: VisibleArea;
		canvas?: HTMLCanvasElement;
		image: {
			width: number;
			height: number;
			transforms: ImageTransforms;
			src: string | null;
		};
	};
	setCoordinates: (transform: Transform | Transform[]) => void;
	refresh: () => void;
	zoom: (factor: number, center?: Point) => void;
	move: (left: number, top?: number) => void;
	rotate: (angle: number) => void;
	flip: (horizontal: boolean, vertical?: boolean) => void;
	reset: () => void;
}

export declare class PreviewResult extends Vue {}

export declare class DraggableArea extends Vue {}

export declare class BoundingBox extends Vue {}

export declare class LineWrapper extends Vue {}

export declare class HandlerWrapper extends Vue {}

export declare class DraggableElement extends Vue {}

export declare class StencilPreview extends Vue {}

export declare class RectangleStencil extends Vue {}

export declare class CircleStencil extends Vue {}

export declare class SimpleHandler extends Vue {}

export declare class SimpleLine extends Vue {}

export declare class Preview extends Vue {
	refresh: () => void;
}
