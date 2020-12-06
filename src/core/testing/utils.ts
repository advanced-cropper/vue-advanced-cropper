import { AspectRatio, ImageRestriction, SizeRestrictions } from '../typings';

const MAX_SIZE = 10;

export class MockFactory {
	seed: number;

	constructor(seed = 42) {
		this.seed = seed;
	}

	random() {
		const x = Math.sin(this.seed++) * 10000;
		return x - Math.floor(x);
	}

	imageRestriction() {
		const variants = ['image', 'fill-area', 'none'] as ImageRestriction[];
		return variants[Math.round(this.random() * 2)];
	}

	visibleArea() {
		return {
			width: this.random() * MAX_SIZE,
			height: this.random() * MAX_SIZE,
			left: this.random() * MAX_SIZE,
			top: this.random() * MAX_SIZE,
		};
	}

	imageSize() {
		return {
			width: this.random() * MAX_SIZE,
			height: this.random() * MAX_SIZE,
			left: this.random() * MAX_SIZE,
			top: this.random() * MAX_SIZE,
		};
	}

	boundaries() {
		return {
			width: this.random() * MAX_SIZE,
			height: this.random() * MAX_SIZE,
			left: this.random() * MAX_SIZE,
			top: this.random() * MAX_SIZE,
		};
	}

	aspectRatio() {
		const aspectRatio: AspectRatio = {};

		if (this.random() > 0.5) {
			aspectRatio.minimum = this.random() * 3;
		}
		if (this.random() > 0.5) {
			if (this.random() > 0.5) {
				if (aspectRatio.minimum) {
					aspectRatio.maximum = aspectRatio.minimum + this.random() * 3;
				} else {
					aspectRatio.maximum = this.random() * 3;
				}
			} else {
				aspectRatio.maximum = aspectRatio.minimum = this.random();
			}
		}
		return aspectRatio;
	}

	sizeRestriction({ valid = true, complete = true } = {}) {
		const result: Partial<SizeRestrictions> = {};

		if (complete || this.random() > 0.5) {
			result.minWidth = this.random() * MAX_SIZE;
		}
		if (complete || this.random() > 0.5) {
			result.minHeight = this.random() * MAX_SIZE;
		}
		if (complete || valid ? result.minWidth : this.random() > 0.5) {
			result.maxWidth = valid ? result.minWidth + this.random() * MAX_SIZE : this.random() * MAX_SIZE;
		}
		if (complete || valid ? result.minHeight : this.random() > 0.5) {
			result.maxHeight = valid ? result.minHeight + this.random() * MAX_SIZE : this.random() * MAX_SIZE;
		}

		return result as SizeRestrictions;
	}
}
