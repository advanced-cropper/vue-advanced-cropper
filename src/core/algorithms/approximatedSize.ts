// This function returns the approximation size to width / height with respect to
// restrictions and aspect ratio
import { AspectRatio, Size, SizeRestrictions } from '../typings';

interface Candidate extends Size {
	correctRatio?: boolean;
}

// Limitations:
// 1. Assume that maximum width and height always larger than minimum width and height
// 2. Assume that aspectRatio.minimum < aspectRatio.maximum
interface ApproximatedSizeParams {
	width: number;
	height: number;
	sizeRestrictions: SizeRestrictions;
	aspectRatio?: AspectRatio;
}
export function approximatedSize(params: ApproximatedSizeParams): Size {
	const { width, height, aspectRatio, sizeRestrictions } = params;
	const ratio = {
		minimum: (aspectRatio && aspectRatio.minimum) || 0,
		maximum: (aspectRatio && aspectRatio.maximum) || Infinity,
	};

	const coordinates = {
		width: Math.max(sizeRestrictions.minWidth, Math.min(sizeRestrictions.maxWidth, width)),
		height: Math.max(sizeRestrictions.minHeight, Math.min(sizeRestrictions.maxHeight, height)),
	};

	function distance(a: Size, b: Size): number {
		return Math.pow(a.width - b.width, 2) + Math.pow(a.height - b.height, 2);
	}

	function isValid(candidate: Candidate, ignoreMinimum = false): boolean {
		return Boolean(
			(candidate.correctRatio ||
				(candidate.width >= candidate.height * ratio.minimum &&
					candidate.width <= candidate.height * ratio.maximum)) &&
				candidate.height <= sizeRestrictions.maxHeight &&
				candidate.width <= sizeRestrictions.maxWidth &&
				candidate.width &&
				candidate.height &&
				(ignoreMinimum ||
					(candidate.height >= sizeRestrictions.minHeight && candidate.width >= sizeRestrictions.minWidth)),
		);
	}

	function findBestCandidate(candidates: Candidate[], ignoreMinimum = false): Candidate | null {
		return candidates.reduce<Candidate | null>((minimum: Candidate | null, candidate: Candidate) => {
			if (isValid(candidate, ignoreMinimum)) {
				return !minimum || distance(candidate, { width, height }) < distance(minimum, { width, height })
					? candidate
					: minimum;
			} else {
				return minimum;
			}
		}, null);
	}

	const candidates: Candidate[] = [];

	if (aspectRatio) {
		[aspectRatio.minimum, aspectRatio.maximum].forEach((ratio) => {
			if (ratio) {
				candidates.push(
					{ width: coordinates.width, height: coordinates.width / ratio, correctRatio: true },
					{ width: coordinates.height * ratio, height: coordinates.height, correctRatio: true },
				);
			}
		});
	}

	if (isValid(coordinates)) {
		candidates.push(coordinates);
	}

	const candidate = (findBestCandidate(candidates) || findBestCandidate(candidates, true)) as Size;

	return {
		width: candidate.width,
		height: candidate.height,
	};
}
