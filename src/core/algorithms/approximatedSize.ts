// This function returns the approximation size to width / height with respect to
// restrictions and aspect ratio
import { AspectRatio, Size, SizeRestrictions } from "../typings";

interface ApproximatedSizeParams {
	width: number;
	height: number;
	aspectRatio: AspectRatio;
	sizeRestrictions: SizeRestrictions;
}
export function approximatedSize(params: ApproximatedSizeParams): Size {
	const { width, height, aspectRatio, sizeRestrictions } = params;
	const ratio = {
		minimum: aspectRatio.minimum || 0,
		maximum: aspectRatio.maximum || Infinity,
	};

	const coordinates = {
		width: Math.max(sizeRestrictions.minWidth, Math.min(sizeRestrictions.maxWidth, width)),
		height: Math.max(sizeRestrictions.minHeight, Math.min(sizeRestrictions.maxHeight, height)),
	};

	function distance(a: Size, b: Size): number {
		return Math.pow(a.width - b.width, 2) + Math.pow(a.height - b.height, 2);
	}

	function isValid(candidate: Size, ignoreMinimum = false): boolean {
		return Boolean(
			candidate.width >= candidate.height * ratio.minimum &&
			candidate.width <= candidate.height * ratio.maximum &&
			candidate.height <= sizeRestrictions.maxHeight &&
			candidate.width <= sizeRestrictions.maxWidth &&
			candidate.width &&
			candidate.height &&
			(ignoreMinimum ||
				(candidate.height >= sizeRestrictions.minHeight && candidate.width >= sizeRestrictions.minWidth)),
		);
	}

	function findBestCandidate(candidates: Size[], ignoreMinimum = false): Size | null {
		return candidates.reduce<Size | null>((minimum: Size | null, candidate: Size) => {
			if (isValid(candidate, ignoreMinimum)) {
				return !minimum || distance(candidate, { width, height }) < distance(minimum, { width, height })
					? candidate
					: minimum;
			} else {
				return minimum;
			}
		}, null);
	}

	const candidates = [];

	[aspectRatio.minimum, aspectRatio.maximum].forEach((ratio) => {
		if (ratio) {
			candidates.push(
				{ width: coordinates.width, height: coordinates.width / ratio },
				{ width: coordinates.height * ratio, height: coordinates.height },
			);
		}
	});

	if (isValid(coordinates)) {
		candidates.push(coordinates);
	}

	const bestCandidate = findBestCandidate(candidates);

	if (bestCandidate) {
		return bestCandidate;
	} else {
		// If there are no candidates that preserves all limitations, choice the best candidate
		// that breaks minimum height or width limitations
		return findBestCandidate(candidates, true) as Size;
	}
}
