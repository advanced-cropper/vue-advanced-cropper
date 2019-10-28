export function directionNames (hDirection, vDirection) {
	let name, classname;
	if (hDirection && vDirection) {
		name = `${hDirection}${vDirection[0].toUpperCase()}${vDirection.slice(1)}`;
		classname = `${hDirection}-${vDirection}`;
	} else {
		name = hDirection || vDirection;
		classname = hDirection || vDirection;
	}
	return { name, classname, };
}

export function isLocal(url) {
	return /^data:/.test(url) || /^blob:/.test(url);
}

export function isCrossOriginURL(url) {
	if (isLocal(url)) {
		return false;
	}
	const pageLocation = window.location;
	const URL_HOST_PATTERN = /(\w+:)?(?:\/\/)([\w.-]+)?(?::(\d+))?\/?/;
	const urlMatch = URL_HOST_PATTERN.exec(url) || [];
	const urlparts = {
		protocol:   urlMatch[1] || '',
		host:       urlMatch[2] || '',
		port:       urlMatch[3] || '',
	};

	const defaultPort = (protocol) => {
		return { 'http:':80, 'https:':443, }[protocol];
	};

	const portOf = (location) => {
		return location.port || defaultPort(location.protocol || pageLocation.protocol);
	};

	return !((!urlparts.protocol && !urlparts.host && !urlparts.port) ||
		Boolean((urlparts.protocol  && (urlparts.protocol  == pageLocation.protocol)) &&
									(urlparts.host      && (urlparts.host       == pageLocation.host))     &&
									(urlparts.host      && (portOf(urlparts)    == portOf(pageLocation)))
		));
}

export function isUndefined(obj) {
	return typeof obj === 'undefined';
}

export function addTimestamp(url) {
	const timestamp = `timestamp=${(new Date()).getTime()}`;
	return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
}
