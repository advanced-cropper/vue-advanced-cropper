type Protocol = 'http' | 'https';

export function directionNames(hDirection, vDirection) {
	let name, classname;
	if (hDirection && vDirection) {
		name = `${hDirection}${vDirection[0].toUpperCase()}${vDirection.slice(1)}`;
		classname = `${hDirection}-${vDirection}`;
	} else {
		name = hDirection || vDirection;
		classname = hDirection || vDirection;
	}
	return { name, classname };
}

export function isBlob(url: string) {
	return /^blob:/.test(url);
}

export function isDataUrl(url: string) {
	return /^data:/.test(url);
}

export function isLocal(url: string) {
	return isBlob(url) || isDataUrl(url);
}

export function isCrossOriginURL(url: string) {
	if (isLocal(url)) {
		return false;
	}
	const pageLocation = window.location;
	const URL_HOST_PATTERN = /(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/;
	const urlMatch = URL_HOST_PATTERN.exec(url) || [];
	const urlparts = {
		protocol: urlMatch[1] || '',
		host: urlMatch[2] || '',
		port: urlMatch[3] || '',
	};

	const defaultPort = (protocol: Protocol) => {
		if (protocol === 'http') {
			return 80;
		} else {
			return 433;
		}
	};

	const portOf = (location: any) => {
		return location.port || defaultPort((location.protocol || pageLocation.protocol) as Protocol);
	};

	return !(
		(!urlparts.protocol && !urlparts.host && !urlparts.port) ||
		Boolean(
			urlparts.protocol &&
				urlparts.protocol == pageLocation.protocol &&
				urlparts.host &&
				urlparts.host == pageLocation.host &&
				urlparts.host &&
				portOf(urlparts) == portOf(pageLocation),
		)
	);
}

export function isFunction(obj: any) {
	return !!(obj && obj.constructor && obj.call && obj.apply);
}

export function isUndefined(obj: any): boolean {
	return obj === undefined;
}

export function isObject(obj) {
	return typeof obj === 'object' && obj !== null;
}

export function getOptions(options: any, defaultScheme: any, falseScheme: any) {
	const result: any = {};
	if (isObject(options)) {
		Object.keys(defaultScheme).forEach((key) => {
			if (isUndefined(options[key])) {
				result[key] = defaultScheme[key];
			} else if (isObject(defaultScheme[key])) {
				if (isObject(options[key])) {
					result[key] = getOptions(options[key], defaultScheme[key], falseScheme[key]);
				} else {
					result[key] = options[key] ? defaultScheme[key] : falseScheme[key];
				}
			} else if (defaultScheme[key] === true || defaultScheme[key] === false) {
				result[key] = Boolean(options[key]);
			} else {
				result[key] = options[key];
			}
		});
		return result;
	} else {
		if (options) {
			return defaultScheme;
		} else {
			return falseScheme;
		}
	}
}

export function getSettings<T extends {}>(param, defaultParams?: T) {
	let result = {
		enabled: Boolean(param),
		...defaultParams,
	};
	if (isObject(param)) {
		result = { ...result, ...param };
	}
	return result;
}

export function parseNumber(number) {
	const parsedNumber = Number(number);
	if (Number.isNaN(parsedNumber)) {
		return number;
	} else {
		return parsedNumber;
	}
}

export function replacedProp(value, oldName, currentName) {
	if (!isEmpty(value) && process.env.NODE_ENV !== 'production') {
		console.warn(`Warning: prop "${oldName}" is deprecated, use "${currentName}" instead. Value:`, value);
	}
	return true;
}

export function isEmpty(obj) {
	return (!obj || Object.keys(obj).length === 0) && typeof obj !== 'function';
}

export function isObjectLike(value) {
	return typeof value === 'object' && value !== null;
}

export function isNumber(value) {
	return (
		typeof (value == 'number' || (isObjectLike(value) && toString.call(value) == '[object Number]')) &&
		!isNaN(value)
	);
}

export function isNumeric(value) {
	return !Number.isNaN(parseFloat(value)) && isFinite(value);
}

export function isNaN(value) {
	return value !== value;
}

export function isLoadedImage(image) {
	return Boolean(image.naturalWidth);
}

export function distance(firstPoint, secondPoint) {
	return Math.sqrt(Math.pow(firstPoint.x - secondPoint.x, 2) + Math.pow(firstPoint.y - secondPoint.y, 2));
}

export function isApproximatelyEqual(a: number, b: number, precision = 0.001) {
	if (a === 0 || b === 0) {
		return Math.abs(b - a) < precision;
	} else {
		return Math.abs(b / a) < 1 + precision && Math.abs(b / a) > 1 - precision;
	}
}

export function sign(value) {
	const number = +value;
	if (number === 0 || isNaN(number)) {
		return number;
	}
	return number > 0 ? 1 : -1;
}

export function radians(angle: number) {
	return (angle * Math.PI) / 180;
}
