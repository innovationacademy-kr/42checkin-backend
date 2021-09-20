Error.stackTraceLimit = 10
export default class ApiError extends Error {
	statusCode: number;
	isFatal: boolean;
	constructor(statusCode: number, message: string, option?: { stack?: string, isFatal?: boolean }) {
		super(message);
		this.statusCode = statusCode;
		if (option) {
			this.isFatal = option.isFatal === undefined ? false : option.isFatal;
			if (option.stack) {
				this.stack = option.stack;
			} else {
				Error.captureStackTrace(this, this.constructor);
			}
		} else {
			this.isFatal = false;
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

