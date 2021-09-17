import { Request, Response, NextFunction } from 'express';
import * as userService from '@service/user.service';
import { catchAsync } from '@modules/error';
import httpStatus from 'http-status';
import logger from '@modules/logger';

/**
 * 카드 체크인
 */
export const checkIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const body = await userService.checkIn(req.user.jwt, req.params.cardid);
	logger.logginResponse({ body, statusCode: httpStatus.OK });
	res.status(httpStatus.OK).json(body);
});

/**
 * 카드 체크아웃
 */
export const checkOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const result = await userService.checkOut(req.user.jwt);
	logger.logginResponse({ body: result, statusCode: httpStatus.OK });
	res.status(httpStatus.OK).json({ result });
});
