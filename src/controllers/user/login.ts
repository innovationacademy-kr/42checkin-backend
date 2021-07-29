import { Request, Response, NextFunction } from 'express';
import UserService from '@service/user.service';
import User from '@entities/user.entity';
import config from '@config/configuration';
import jwt from 'jsonwebtoken';
import { URL } from 'url';

/**
 * 42API 로그인 후 리다이렉트 되는 엔드포인트입니다.
 * 42API에서 유저 정보를 가져와 JWT 토큰을 발행합니다.
 * JWT토큰을 쿠키에 w_auth로 담아 전송합니다.
 * /checkin 페이지로 리다이렉트 합니다.
 * @param req
 * @param res
 * @param next
 */
const callback = async (req: Request, res: Response, next: NextFunction)  => {
	if (req.user) {
		const user = req.user as User;
		const token = await UserService.login(user);
		const decoded = jwt.decode(token) as any;
		const cookieOption: { domain?: string; expires: any } = {
			expires: new Date(decoded.exp * 1000)
		};
		try {
			const url_info = new URL(config.url.client);
			cookieOption.domain = url_info.hostname;
			res.cookie(config.cookie.auth, token, cookieOption);
			res.status(302).redirect(config.url.client + '/checkin');
		} catch (error) {
			res.status(500).json({ result: false });
		}
	} else {
		res.status(403).json({ result: false });
	}
}

export default {
	callback
}