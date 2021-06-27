import { Request, Response, NextFunction } from 'express';
import BaseRoute from '@controllers/baseRoute';
import UserService from '@service/user.service';
import passport from 'passport';
import { JwtStrategy } from '@strategy/jwt.strategy';

export default class Check extends BaseRoute {
	public static path = '/';
	private static instance: Check;
	private constructor() {
		super();
		passport.use(JwtStrategy());
		this.init();
	}

	static get router() {
		if (!Check.instance) {
			Check.instance = new Check();
		}
		return Check.instance.router;
	}

	private init() {
		this.router.post('/checkIn/:cardId', passport.authenticate('jwt'), (req, res, next) =>
			this.checkIn(req, res, next)
		);
		this.router.post('/checkOut', passport.authenticate('jwt'), (req, res, next) => this.checkOut(req, res, next));
	}

	private async checkIn(req: Request, res: Response, next: NextFunction) {
		const user = req.user as any;
		if (user) {
			const { cardId } = req.params;
			const result = await UserService.service.checkIn(user._id, cardId);
			res.status(result ? 200 : 400).json({ result });
		} else {
			res.status(403).json({ result: false });
		}
	}

	private async checkOut(req: Request, res: Response, next: NextFunction) {
		const user = req.user as any;
		if (user) {
			const result = await UserService.service.checkOut(user._id);
			res.status(result ? 200 : 400).json({ result });
		} else {
			res.status(403).json({ result: false });
		}
	}
}
