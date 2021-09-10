import { Request, Response, NextFunction } from 'express';
import * as userService from '@service/user.service';
import { catchAsync } from '@modules/error';

/**
 * 카드 체크인
 */
export const checkIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const { result, notice } = await userService.checkIn(req.user.jwt, req.params.cardid);
	res.status(200).json({ result, notice });
});

/**
 * 카드 체크아웃
 */
export const checkOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const result = await userService.checkOut(req.user.jwt);
	res.status(200).json({ result });
});
