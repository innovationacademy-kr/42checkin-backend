import { Request, Response, NextFunction } from 'express';
import userService from '@service/user.service';

/**
 * 카드 체크인
 */
const checkIn = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as any;
	if (user) {
		const { cardId } = req.params;
		const result = await userService.checkIn(user._id, cardId);
		res.status(result ? 200 : 400).json({ result });
	} else {
		res.status(403).json({ result: false });
	}
}

/**
 * 카드 체크아웃
 */
const checkOut = async (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as any;
	if (user) {
		const result = await userService.checkOut(user._id);
		res.status(result ? 200 : 400).json({ result });
	} else {
		res.status(403).json({ result: false });
	}
}

export default {
	checkIn,
	checkOut
}