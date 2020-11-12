import { distance } from './utils';

export function calculateGeometricProperties(touches: Touch[], container: HTMLElement) {
	const { left, top } = container.getBoundingClientRect();

	const centerMass = { left: 0, top: 0 };
	let spread = 0;

	touches.forEach((touch) => {
		centerMass.left += (touch.clientX - left) / touches.length;
		centerMass.top += (touch.clientY - top) / touches.length;
	});

	touches.forEach((touch) => {
		spread += distance(
			{ x: centerMass.left, y: centerMass.top },
			{ x: touch.clientX - left, y: touch.clientY - top },
		);
	});

	return { centerMass, spread, count: touches.length };
}
