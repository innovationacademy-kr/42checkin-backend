import { Request, Response, NextFunction } from 'express';
import userService from '@service/user.service';
import { catchAsync } from 'src/middlewares/error';

/**
 * 카드 체크인
 */
const checkIn = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const result = await userService.checkIn(req.user.jwt, req.params.cardId);
	res.status(200).json({ result });
});

/**
 * 카드 체크아웃
 */
const checkOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
	const result = await userService.checkOut(req.user.jwt);
	res.status(200).json({ result });
});

export default {
	checkIn,
	checkOut
}