export default class ApiError extends Error {
	statusCode: number;
	isFatal: boolean;
	constructor(statusCode: number, message: string, option?: { stack?: string, isFatal?: boolean }) {
		super(message);
		this.statusCode = statusCode;
		this.isFatal = option.isFatal === undefined ? false : option.isFatal;
		if (option.stack) {
			this.stack = option.stack;
		} else {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

