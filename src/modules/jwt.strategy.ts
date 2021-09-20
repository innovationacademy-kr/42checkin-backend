import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import env from '@modules/env';
import jwt from 'jsonwebtoken';
import logger from '@modules/logger';
import { Users } from '@models/users';

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromExtractors([
		(req: Request) => {
			return req.cookies[env.cookie.auth];
		}
	]),
	ignoreExpiration: false,
	secretOrKey: env.jwt.secret
};

const validate = (payload: any) => {
    logger.info({
        type: 'get',
        message: 'jwt data',
        data: payload,
    });
	return { _id: payload.sub, name: payload.username };
};

const strategyCallback = (jwt_payload: { sub: any; username: any }, done: any) => {
	const user = validate(jwt_payload);
	if (user._id) {
		return done(null, { jwt: user });
	} else {
		return done(null, null);
	}
};

export const JwtStrategy = () => new Strategy(opts, strategyCallback);

export const generateToken = async (user: Users): Promise<string> => {
	try {
		const payload = {
			username: user.login,
			sub: user._id
		};
		const token = jwt.sign(payload, env.jwt.secret, { expiresIn: '7d' });
        logger.info({
            type: 'get',
            message: 'tokan',
            data: { token, payload },
        });
		return token;
	} catch (e) {
		logger.error(e);
		throw e;
	}
};

export interface IJwtUser {
	_id: number;
	name: string;
}
