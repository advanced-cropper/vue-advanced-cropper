import { XHR_DONE } from './constants';

export function prepareSource(canvas, image, { flipped, orientation, }) {
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
		ctx.rotate(180 / 180 * Math.PI);
	} else if (orientation == 4) {
		ctx.translate(0, height);
		ctx.scale(1, -1);
	} else if (orientation == 5) {
		ctx.rotate(90 / 180 * Math.PI);
		ctx.scale(1, -1);
	} else if (orientation == 6) {
		ctx.rotate(90 / 180 * Math.PI);
		ctx.translate(0, -height);
	} else if (orientation == 7) {
		ctx.rotate(270 / 180 * Math.PI);
		ctx.translate(-width, height);
		ctx.scale(1, -1);
	} else if (orientation == 8) {
		ctx.translate(0, width);
		ctx.rotate(270 / 180 * Math.PI);
	}

	ctx.drawImage(image, 0, 0, width, height);
	ctx.restore();

	return canvas;
}

export function getImageTransforms(orientation) {
	let result = {
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

export function getStyleTransforms({ rotate, scaleX, scaleY, }) {
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

export function parseImage(img) {
	return new Promise((resolve) => {
		getImageData(img)
			.then(data => {
				resolve(data ? getOrientation(data) : { arrayBuffer: null, orientation: null, });
			})
			.catch((error) => {
				console.warn(error);
				resolve({ arrayBuffer: null, orientation: null, });
			});
	});
}

function getImageData(img) {
	return new Promise((resolve, reject) => {
		try {
			if (img) {
				// Data URL
				if (/^data:/i.test(img)) {
					resolve(base64ToArrayBuffer(img));
				// Blob
				} else if (/^blob:/i.test(img)) {
					const fileReader = new FileReader();
					fileReader.onload = function (e) {
						resolve(e.target.result);
					};
					objectURLToBlob(img, function (blob) {
						fileReader.readAsArrayBuffer(blob);
					});
				// Simple URL
				} else {
					let http = new XMLHttpRequest();
					http.onreadystatechange = function () {
						if (this.readyState !== XHR_DONE) return;

						if (this.status === 200 || this.status === 0) {
							resolve(this.response);
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
					http.withCredentials  = false;
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

function base64ToArrayBuffer(base64) {
	base64 = base64.replace(/^data:([^;]+);base64,/gmi, '');
	const binary = atob(base64);
	const len = binary.length;
	const buffer = new ArrayBuffer(len);
	const view = new Uint8Array(buffer);
	for (let i = 0; i < len; i++) {
		view[i] = binary.charCodeAt(i);
	}
	return buffer;
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
	const dataView = new DataView(arrayBuffer);
	let length = dataView.byteLength;
	let orientation;
	let exifIDCode;
	let tiffOffset;
	let firstIFDOffset;
	let littleEndian;
	let endianness;
	let app1Start;
	let ifdStart;
	let offset;
	// Only handle JPEG image (start by 0xFFD8)
	if (dataView.getUint8(0) === 0xFF && dataView.getUint8(1) === 0xD8) {
		offset = 2;
		while (offset < length) {
			if (dataView.getUint8(offset) === 0xFF && dataView.getUint8(offset + 1) === 0xE1) {
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
			endianness = dataView.getUint16(tiffOffset);
			littleEndian = endianness === 0x4949;

			if (littleEndian || endianness === 0x4D4D /* bigEndian */) {
				if (dataView.getUint16(tiffOffset + 2, littleEndian) === 0x002A) {
					firstIFDOffset = dataView.getUint32(tiffOffset + 4, littleEndian);

					if (firstIFDOffset >= 0x00000008) {
						ifdStart = tiffOffset + firstIFDOffset;
					}
				}
			}
		}
	}
	if (ifdStart) {
		length = dataView.getUint16(ifdStart, littleEndian);

		for (let i = 0; i < length; i++) {
			offset = ifdStart + i * 12 + 2;
			if (dataView.getUint16(offset, littleEndian) === 0x0112 /* Orientation */) {
				// 8 is the offset of the current tag's value
				offset += 8;
				// Get the original orientation value
				orientation = dataView.getUint16(offset, littleEndian);
				break;
			}
		}
	}
	return orientation;
}
