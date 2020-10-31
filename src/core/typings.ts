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

export type PositionRestrictions = Limits;
export type AreaRestrictions = Limits;

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

export interface CropperEvent {
	type: EventType;
}

export interface Diff {
	left: number;
	top: number;
}

export interface Position {
	left: number;
	top: number;
}

export type PositionDirection = 'left' | 'top' | 'right' | 'bottom';
export type HorizontalDirection = 'left' | 'right';
export type VerticalDirection = 'top' | 'bottom';
export type MainDirections = 'left' | 'top';

export type EventType = 'resize' | 'move' | 'drag' | 'manipulateImage';

export type ImageRestriction = 'area' | 'stencil' | 'none';


export interface Scale {
	factor: number;
	center: Point;
}

export interface ImageTransforms {
	orientation: number;
	scaleX?: number;
	scaleY?: number;
	rotate?: number;
	flipped?: boolean;
}
