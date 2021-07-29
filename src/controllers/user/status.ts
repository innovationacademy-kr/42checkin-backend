import { Request, Response, NextFunction } from 'express';
import userService from '@service/user.service';
import logger from '@lib/logger';

/**
 * 유저 상태조회
 */
const status = async(req: Request, res: Response, next: NextFunction) => {
	const user = req.user as any;
	logger.debug('staus', { user });
	if (user) {
		const status = await userService.status(user._id);
		res.json(status).status(200);
	} else {
		res.status(403).json({ result: false });
	}
}

/**
 * 강제 체크아웃
 */
const forceCheckout = async(req: Request, res: Response, next: NextFunction) => {
	const user = req.user as any;
	if (user) {
		const { userId } = req.params;
		try {
			const result = await userService.forceCheckOut(user._id, userId);
			res.status(200).json({
				result
			});
		} catch (error) {
			res.status(403).json({
				result: false,
				error
			});
		}
	} else {
		res.status(403).json({ result: false });
	}
}

export default {
	status,
	forceCheckout
}