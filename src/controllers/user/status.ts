import { Request, Response, NextFunction } from 'express';
import passport from "passport";
import BaseRoute from "@controllers/baseRoute";
import UserService from '@service/user.service';
import { JwtStrategy } from '@strategy/jwt.strategy';

export default class Status extends BaseRoute {
	public static path = '/';
	private static instance: Status;
	private userService: UserService;
	private constructor() {
		super();
		passport.use(JwtStrategy());
		this.init();
		this.userService = UserService.service;
	}

	static get router() {
		if (!Status.instance) {
			Status.instance = new Status();
		}
		return Status.instance.router;
	}

	private init() {
		this.router.get('/status', passport.authenticate('jwt'),(req,res, next) => this.status(req,res, next));
		this.router.post('/forceCheckout/:userId', passport.authenticate('jwt'),(req,res, next) => this.forceCheckout(req,res, next));
	}

	private async status (req: Request, res: Response, next: NextFunction) {
		const user = req.user as any;
		console.log('staus',{ user});
		if (user) {
			const status = await this.userService.status(user._id);
			res.json(status).status(200);
		} else {
			res.status(403);
		}
	}
	private async forceCheckout (req: Request, res: Response, next: NextFunction) {
		const user = req.user as any;
		if (user) {
			const {userId} = req.params;
			return await this.userService.forceCheckOut(user._id, userId);
		} else {
			res.status(403);
		}
	}
}