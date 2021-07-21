import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import BaseRoute from '@controllers/baseRoute';
import UserService from '@service/user.service';
import { JwtStrategy } from '@strategy/jwt.strategy';
import logger from '../../lib/logger';

export default class Status extends BaseRoute {
	public static path = '/';
	private static instance: Status;

	private constructor() {
		super();
		passport.use(JwtStrategy());
		this.init();
	}

	static get router() {
		if (!Status.instance) {
			Status.instance = new Status();
		}
		return Status.instance.router;
	}

	private init() {
		this.router.get('/status', passport.authenticate('jwt'), (req, res, next) => this.status(req, res, next));
		this.router.post('/forceCheckout/:userId', passport.authenticate('jwt'), (req, res, next) =>
			this.forceCheckout(req, res, next)
		);
	}

	private async status(req: Request, res: Response, next: NextFunction) {
		const user = req.user as any;
		logger.debug('staus', { user });
		if (user) {
			const status = await UserService.service.status(user._id);
			res.json(status).status(200);
		} else {
			res.status(403).json({ result: false });
		}
	}
	private async forceCheckout(req: Request, res: Response, next: NextFunction) {
		const user = req.user as any;
		if (user) {
			const { userId } = req.params;
			try {
				const result = await UserService.service.forceCheckOut(user._id, userId);
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
}
