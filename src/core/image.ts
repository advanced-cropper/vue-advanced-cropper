import { ImageTransforms } from './typings';

export const XHR_DONE = 4;

export function prepareSource(canvas, image, { flipped, orientation }) {
	const width = image.naturalWidth;
	const height = image.naturalHeight;

	const ctx = canvas.getContext('2d');
	canvas.width = width;
	canvas.height = height;

	ctx.save();

	if (flipped) {
		canvas.width = height;
		canvas.height = width;
	}

	// TODO: refactor this
	if (orientation == 2) {
		ctx.translate(width, 0);
		ctx.scale(-1, 1);
	} else if (orientation == 3) {
		ctx.translate(width, height);
		ctx.rotate((180 / 180) * Math.PI);
	} else if (orientation == 4) {
		ctx.translate(0, height);
		ctx.scale(1, -1);
	} else if (orientation == 5) {
		ctx.rotate((90 / 180) * Math.PI);
		ctx.scale(1, -1);
	} else if (orientation == 6) {
		ctx.rotate((90 / 180) * Math.PI);
		ctx.translate(0, -height);
	} else if (orientation == 7) {
		ctx.rotate((270 / 180) * Math.PI);
		ctx.translate(-width, height);
		ctx.scale(1, -1);
	} else if (orientation == 8) {
		ctx.translate(0, width);
		ctx.rotate((270 / 180) * Math.PI);
	}

	ctx.drawImage(image, 0, 0, width, height);
	ctx.restore();

	return canvas;
}

function base64ToArrayBuffer(base64) {
	base64 = base64.replace(/^data:([^;]+);base64,/gim, '');
	const binary = atob(base64);
	const len = binary.length;
	const buffer = new ArrayBuffer(len);
	const view = new Uint8Array(buffer);
	for (let i = 0; i < len; i++) {
		view[i] = binary.charCodeAt(i);
	}
	return buffer;
}

function objectURLToBlob(url, callback) {
	const http = new XMLHttpRequest();
	http.open('GET', url, true);
	http.responseType = 'blob';
	http.onload = function () {
		if (this.status == 200 || this.status === 0) {
			callback(this.response);
		}
	};
	http.send();
}

export function getImageTransforms(orientation: number) {
	const result: ImageTransforms = {
		orientation,
	};
	if (orientation) {
		switch (orientation) {
			case 2:
				result.scaleX = -1;
				break;
			case 3:
				result.rotate = -180;
				break;
			case 4:
				result.scaleY = -1;
				break;
			case 5:
				result.rotate = 90;
				result.scaleY = -1;
				break;
			case 6:
				result.rotate = 90;
				break;
			case 7:
				result.rotate = 90;
				result.scaleX = -1;
				break;
			case 8:
				result.rotate = -90;
				break;
		}
	}
	if (result.rotate === 90 || result.rotate === -90) {
		result.flipped = true;
	}
	return result;
}
function getImageData(img) {
	return new Promise((resolve, reject) => {
		try {
			if (img) {
				if (/^data:/i.test(img)) {
					// Data URL
					resolve(base64ToArrayBuffer(img));
				} else if (/^blob:/i.test(img)) {
					// Blob
					const fileReader = new FileReader();
					fileReader.onload = function (e) {
						resolve(e.target.result);
					};
					objectURLToBlob(img, function (blob) {
						fileReader.readAsArrayBuffer(blob);
					});
				} else {
					// Simple URL
					let http = new XMLHttpRequest();
					http.onreadystatechange = function () {
						if (http.readyState !== XHR_DONE) return;

						if (http.status === 200 || http.status === 0) {
							resolve(http.response);
						} else {
							reject('Warning: could not load an image to parse its orientation');
						}
						http = null;
					};
					http.onprogress = function () {
						// Abort the request directly if it not a JPEG image for better performance
						if (http.getResponseHeader('content-type') !== 'image/jpeg') {
							http.abort();
						}
					};
					http.withCredentials = false;
					http.open('GET', img, true);
					http.responseType = 'arraybuffer';
					http.send(null);
				}
			} else {
				reject('Error: the image is empty');
			}
		} catch (e) {
			reject(e);
		}
	});
}

export function getStyleTransforms({ rotate, scaleX, scaleY }) {
	let transform = '';
	if (rotate || scaleX || scaleY) {
		if (rotate) {
			transform += ` rotate(${rotate}deg) `;
		}
		if (scaleX) {
			transform += ` scaleX(${scaleX}) `;
		}
		if (scaleY) {
			transform += ` scaleY(${scaleY}) `;
		}
	}
	return transform;
}

function getStringFromCharCode(dataView, start, length) {
	let str = '';
	let i;
	for (i = start, length += start; i < length; i++) {
		str += String.fromCharCode(dataView.getUint8(i));
	}
	return str;
}

function getOrientation(arrayBuffer) {
	try {
		const dataView = new DataView(arrayBuffer);
		let orientation;
		let exifIDCode;
		let tiffOffset;
		let littleEndian;
		let app1Start;
		let ifdStart;
		// Only handle JPEG image (start by 0xFFD8)
		if (dataView.getUint8(0) === 0xff && dataView.getUint8(1) === 0xd8) {
			const length = dataView.byteLength;
			let offset = 2;
			while (offset + 1 < length) {
				if (dataView.getUint8(offset) === 0xff && dataView.getUint8(offset + 1) === 0xe1) {
					app1Start = offset;
					break;
				}
				offset++;
			}
		}
		if (app1Start) {
			exifIDCode = app1Start + 4;
			tiffOffset = app1Start + 10;
			if (getStringFromCharCode(dataView, exifIDCode, 4) === 'Exif') {
				const endianness = dataView.getUint16(tiffOffset);

				littleEndian = endianness === 0x4949;

				if (littleEndian || endianness === 0x4d4d /* bigEndian */) {
					if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002a) {
						const firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);
						if (firstIFDOffset >= 0x00000008) {
							ifdStart = tiffOffset + firstIFDOffset;
						}
					}
				}
			}
		}
		if (ifdStart) {
			const length = dataView.getUint16(ifdStart, littleEndian);

			for (let i = 0; i < length; i++) {
				let offset = ifdStart + i * 12 + 2;
				if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
					// 8 is the offset of the current tag's value
					offset += 8;
					// Get the original orientation value
					orientation = dataView.getUint16(offset, littleEndian);
					// Override the orientation with its default value
					dataView.setUint16(offset, 1, littleEndian);
					break;
				}
			}
		}
		return orientation;
	} catch (error) {
		return null;
	}
}

export function parseImage(src: string) {
	return new Promise((resolve) => {
		getImageData(src)
			.then((data) => {
				resolve(
					data
						? { source: src, arrayBuffer: data, orientation: getOrientation(data) }
						: { source: src, arrayBuffer: null, orientation: null },
				);
			})
			.catch((error) => {
				console.warn(error);
				resolve({ source: src, arrayBuffer: null, orientation: null });
			});
	});
}

export function arrayBufferToDataURL(arrayBuffer) {
	const chunks = [];

	// Chunk Typed Array for better performance
	const chunkSize = 8192;
	let uint8 = new Uint8Array(arrayBuffer);

	while (uint8.length > 0) {
		const value = uint8.subarray(0, chunkSize);
		chunks.push(String.fromCharCode.apply(null, Array.from ? Array.from(value) : value.slice()));
		uint8 = uint8.subarray(chunkSize);
	}

	return `data:image/jpeg;base64,${btoa(chunks.join(''))}`;
}
