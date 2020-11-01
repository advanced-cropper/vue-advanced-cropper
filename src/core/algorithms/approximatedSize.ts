// This function returns the approximation size to width / height with respect to
// restrictions and aspect ratio
import { AspectRatio, Size, SizeRestrictions } from '../typings';
import { ratio } from '../service';

interface CandidateSize extends Size {
	// Additional param to prevent double precision problems
	correctRatio?: boolean;
}

interface ValidateSizeParams {
	size: CandidateSize;
	aspectRatio: AspectRatio;
	sizeRestrictions: SizeRestrictions;
	ignoreMinimum?: boolean;
}
function validateSize(params: ValidateSizeParams): boolean {
	const { size, aspectRatio, ignoreMinimum, sizeRestrictions } = params;
	return Boolean(
		(size.correctRatio || (ratio(size) >= aspectRatio.minimum && ratio(size) <= aspectRatio.maximum)) &&
			size.height <= sizeRestrictions.maxHeight &&
			size.width <= sizeRestrictions.maxWidth &&
			size.width &&
			size.height &&
			(ignoreMinimum || (size.height >= sizeRestrictions.minHeight && size.width >= sizeRestrictions.minWidth)),
	);
}

function distance(a: Size, b: Size): number {
	return Math.pow(a.width - b.width, 2) + Math.pow(a.height - b.height, 2);
}

// Limitations:
// 1. Assume that maximum width and height always larger than minimum width and height
// 2. Assume that aspectRatio.minimum < aspectRatio.maximum
// If you break this limitations function could return null!
interface ApproximatedSizeParams {
	width: number;
	height: number;
	sizeRestrictions: SizeRestrictions;
	aspectRatio?: AspectRatio;
}
export function approximatedSize(params: ApproximatedSizeParams): Size {
	const { width, height, sizeRestrictions } = params;

	const aspectRatio = {
		minimum: (params.aspectRatio && params.aspectRatio.minimum) || 0,
		maximum: (params.aspectRatio && params.aspectRatio.maximum) || Infinity,
	};

	const coordinates = {
		width: Math.max(sizeRestrictions.minWidth, Math.min(sizeRestrictions.maxWidth, width)),
		height: Math.max(sizeRestrictions.minHeight, Math.min(sizeRestrictions.maxHeight, height)),
	};

	function findBestCandidate(candidates: CandidateSize[], ignoreMinimum = false): CandidateSize | null {
		return candidates.reduce<CandidateSize | null>((minimum: CandidateSize | null, size: CandidateSize) => {
			if (validateSize({ size, aspectRatio, sizeRestrictions, ignoreMinimum })) {
				return !minimum || distance(size, { width, height }) < distance(minimum, { width, height })
					? size
					: minimum;
			} else {
				return minimum;
			}
		}, null);
	}

	const candidates: CandidateSize[] = [];

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

	if (validateSize({ size: coordinates, aspectRatio, sizeRestrictions })) {
		candidates.push(coordinates);
	}

	const candidate = findBestCandidate(candidates) || findBestCandidate(candidates, true);

	return (
		candidate && {
			width: candidate.width,
			height: candidate.height,
		}
	);
}
