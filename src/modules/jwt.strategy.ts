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
	logger.info(`jwt extracted data: `, { payload });
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
        // FIXME:
		/*const payload = {
			username: user.userName,
			sub: user._id
		};
		const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
		logger.info(`token payload: `, payload);
		logger.info('new token generated: ', token);
		return token;*/

        return "";
	} catch (e) {
		logger.error('generateToken fail', e);
		throw e;
	}
};

export interface IJwtUser {
	_id: number;
	name: string;
}
