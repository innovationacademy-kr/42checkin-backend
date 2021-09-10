import config from '@config/configuration';
import ApiError from '@lib/errorHandle';
import logger from '@lib/logger';
import { sendErrorMessage } from '@lib/slack';
import { Request, Response, NextFunction } from 'express';
import httpStatus  from "http-status";
import rTracer from 'cls-rtracer';
import { IpDeniedError } from 'express-ipfilter'

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
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	let { statusCode, message } = err;
	if (err instanceof IpDeniedError) {
      res.status(401).json({
		message: '42seoul Guest WiFi를 사용해주세요.'
	  })
    } else {
      res.status(err.status || 500)
    }

	if (config.env === 'production' && !err.isOperational) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}

	// req.locals: request의 라이프 타임 동안에만 유효한 프로퍼티
	res.locals.errorMessage = err.message;

	const response = {
		code: statusCode,
		message,
		...config.env === 'development' && { stack: err.stack }
	};

	if (config.env === 'development') {
		logger.error(err);
	} else {
		sendErrorMessage({
			...logger.error(err),
			statusCode: err.statusCode || req.statusCode,
			uid: rTracer.id()
		})
	}

	res.status(statusCode).send(response);
};

export const catchAsync = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};