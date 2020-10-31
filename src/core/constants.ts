import { HorizontalDirection, PositionDirection, VerticalDirection, MainDirections } from './typings';

export const ALL_DIRECTIONS: PositionDirection[] = ['left', 'right', 'top', 'bottom'];
export const HORIZONTAL_DIRECTIONS: HorizontalDirection[] = ['left', 'right'];
export const VERTICAL_DIRECTIONS: VerticalDirection[] = ['top', 'bottom'];
export const MAIN_DIRECTIONS: MainDirections[] = ['left', 'top'];
export const IMAGE_RESTRICTIONS = ['area', 'stencil', 'none'];
export const XHR_DONE = 4;

export const DEFAULT_COORDINATES = {
	left: 0,
	top: 0,
	width: 0,
	height: 0,
};
