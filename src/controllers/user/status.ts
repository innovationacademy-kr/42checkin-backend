import logger from '@modules/logger';
import * as userService from '@service/user.service';
import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '@modules/error';

/**
 * 유저 상태조회
 */
export const status = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user.jwt;
	logger.debug('staus', { user });
	const status = await userService.status(req.user.jwt);
	res.json(status).status(200);
});

/**
 * 강제 체크아웃
 */
export const forceCheckout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req.params;
	const result = await userService.forceCheckOut(req.user.jwt, userId);
	res.status(200).json({
		result: result ? true : false
	});
});
