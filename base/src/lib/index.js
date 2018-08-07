module.exports = {
	get Fetch() { return require('./Fetch').default; },
	get ConvertUtil() { return require('./ConvertUtil'); },
	get ValidateUtil() { return require('./ValidateUtil'); },
	get ImageUtil() { return require('./imageUtil'); },
	get StringFmtUtil() { return require('./StringFmtUtil'); },
	get Uploader() { return require('./Uploader').default; },
	get ImallCookies() { return require('./ImallCookies').default; },
	get Cookie() { return require('./Cookie') },
	get Storage() { return require('./Storage').default; },
	get PureRender() { return require('./PureRender') },
	get UtilDateTime() { return require('./UtilDateTime') },
	get StorageUtils() { return require('./StorageUtils') },
	get RXUtil() { return require('./RXUtil') }
};