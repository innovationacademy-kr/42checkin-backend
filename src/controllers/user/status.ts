import { Request, Response, NextFunction } from 'express';
import userService from '@service/user.service';
import logger from '@lib/logger';
import { catchAsync } from 'src/middlewares/error';

/**
 * 유저 상태조회
 */
const status = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user.jwt;
	logger.debug('staus', { user });
	const status = await userService.status(req.user.jwt);
	res.json(status).status(200);
});

/**
 * 강제 체크아웃
 */
const forceCheckout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req.params;
	const result = await userService.forceCheckOut(req.user.jwt, userId);
	res.status(200).json({
		result: result ? true : false
	});
});

export default {
	status,
	forceCheckout
};
