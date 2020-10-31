import { Size, VisibleArea } from "../typings";
import { ratio } from "../service";

interface DefaultVisibleAreaParams {
	imageSize: Size;
	boundaries: Size;
}
export function defaultVisibleArea(params: DefaultVisibleAreaParams): VisibleArea {
	const { imageSize, boundaries } = params;

	const imageRatio = ratio(imageSize);
	const boundaryRatio = ratio(boundaries);

	const areaProperties = {
		height: imageRatio > boundaryRatio ? imageSize.height : imageSize.width / boundaryRatio,
		width: imageRatio > boundaryRatio ? imageSize.height * boundaryRatio : imageSize.width,
	};

	return {
		left: imageSize.width / 2 - areaProperties.width / 2,
		top: imageSize.height / 2 - areaProperties.height / 2,
		width: areaProperties.width,
		height: areaProperties.height,
	};
}
