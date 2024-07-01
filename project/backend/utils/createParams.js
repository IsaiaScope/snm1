function createParams(params) {
	if (Object.keys(params).length === 0) {
		return '';
	}
	const queryString = Object.keys(params)
		.filter(key => params[key] !== '' && params[key] != null)
		.map(key => `${key}=${encodeURIComponent(params[key])}`)
		.join('&');

	return queryString ? `?${queryString}` : '';
}

module.exports = createParams;
