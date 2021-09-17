import ApiError from '@modules/api.error';
import logger from '@modules/logger';
import { sendErrorMessage } from '@modules/slack';
import { Request, Response, NextFunction } from 'express';
import env from '@modules/env';
import httpStatus from "http-status";
import rTracer from 'cls-rtracer';

/**
 * 에러객체를 확인하고, 지정된 에러객체가 아니면 에러객체를 수정함
 */
export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
	let error = err;
	if (!(err instanceof ApiError)) {
		const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
		const message = error.message || httpStatus[statusCode];
		error = new ApiError(statusCode, message, err.stack);
	}
	next(error);
};

/**
 * 에러내용을 응답함
 */
export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
	let { statusCode, message } = err;

	const response: { code: number, message: string, stack: string } = {
		code: statusCode,
		message,
        stack: undefined
	};

	if (['development', 'devtest'].includes(env.node_env)) {
		response.stack = err.stack;
		logger.error(err);
	} else {
		if (err.isFatal) {
			sendErrorMessage({
				...logger.fatal(err),
				statusCode: err.statusCode || req.statusCode,
				uid: rTracer.id()
			})
		} else {
			logger.error(err)
		}
	}

	res.status(statusCode).send(response);
};

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
	Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};