import { Request, Response, NextFunction } from 'express';
import * as userService from '@service/user.service';
import logger from '@lib/logger';
import { catchAsync } from 'src/middlewares/error';
import httpStatus from 'http-status';

/**
 * 유저 상태조회
 */
export const status = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user.jwt;
	logger.debug('staus', { user });
	const body = await userService.status(req.user.jwt);
	logger.logginResponse({ body, statusCode: httpStatus.OK });
	res.status(httpStatus.OK).json(body);
});

/**
 * 강제 체크아웃
 */
export const forceCheckout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req.params;
	const body = await userService.forceCheckOut(req.user.jwt, userId);
	logger.logginResponse({ body, statusCode: httpStatus.OK });
	res.status(httpStatus.OK).json({ result: !!body	});
});
