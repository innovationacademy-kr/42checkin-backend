import BaseRoute from '../baseRoute';
import { Request, Response, NextFunction } from 'express';
import UserService from '@service/user.service';
import passport from 'passport';
import User from '@entities/user.entity';
import Strategy42 from '@strategy/ft.strategy';
import config from '@config/configuration';

export default class Login extends BaseRoute {
	public static path = '/login';
	// TODO: react프로젝트용으로 redirect url 설정해야함
	private redirectUrlOrigin = config.env === 'development' ? 'http://localhost:3001' : config.url.client;
	private static instance: Login;
	private constructor() {
		super();
		passport.use(Strategy42());
		this.init();
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
			const token = await UserService.service.login(user);
			console.log({token});
			const cookieOption: {domain?: string} = {};
			if (config.env === 'production' || config.env === 'test') {
				cookieOption.domain = '.42seoul.io'
			}
			res.cookie('w_auth', token, cookieOption);
			console.log(this.redirectUrlOrigin)
			res.status(302).redirect(this.redirectUrlOrigin + '/submit');
		} else {
			res.status(403).json({ result: false });
		}
	};
}
