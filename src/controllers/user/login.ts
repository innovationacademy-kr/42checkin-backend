import BaseRoute from '../baseRoute';
import { Request, Response, NextFunction } from 'express';
import UserService from '@service/user.service';
import passport from 'passport';
import User from '@entities/user.entity';
import Strategy42 from '@strategy/ft.strategy';
import config from '@config/configuration';

export default class Login extends BaseRoute {
	public static path = '/login';
	private redirectUrlOrigin = config.env === 'development' ? 'http://localhost:3001' : '';
	private static instance: Login;
	private userService: UserService;
	private constructor() {
		super();
		passport.use(Strategy42());
		this.init();
		this.userService = UserService.service;
	}

	static get router() {
		if (!Login.instance) {
			Login.instance = new Login();
		}
		return Login.instance.router;
	}

	private init() {
		this.router.get('/', passport.authenticate('42', { failureRedirect: this.redirectUrlOrigin + '/' }));
		this.router.get('/callback', passport.authenticate('42', { failureRedirect: this.redirectUrlOrigin + '/' }), (req,res, next) => this.callback(req,res, next));
	}

	/**
	 * 42API 로그인 후 리다이렉트 되는 엔드포인트입니다.
	 * 42API에서 유저 정보를 가져와 JWT 토큰을 발행합니다.
	 * JWT토큰을 쿠키에 w_auth로 담아 전송합니다.
	 * /submit 페이지로 리다이렉트 합니다.
	 * @param req
	 * @param res
	 * @param next
	 */
	private async callback (req: Request, res: Response, next: NextFunction) {
		if (req.user) {
			const user = req.user as User;
			const token = await this.userService.login(user);
			console.log({token});
			res.cookie('w_auth', token);
			res.status(302).redirect(this.redirectUrlOrigin + '/submit');
		}
	};
}
