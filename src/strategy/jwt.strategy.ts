import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import User from '@entities/user.entity';
import config from '@config/configuration';
import jwt from 'jsonwebtoken';
import logger from '@lib/logger';

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromExtractors([
		(req: Request) => {
			return req.cookies[config.cookie.auth];
		}
	]),
	ignoreExpiration: false,
	secretOrKey: config.jwt.secret
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

export const generateToken = async (user: User): Promise<string> => {
	try {
		const payload = {
			username: user.getName(),
			sub: user.getId()
		};
		const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
		logger.info(`token payload: `, payload);
		logger.info('new token generated: ', token);
		return token;
	} catch (e) {
		logger.error('generateToken fail', e);
		throw e;
	}
};

export interface IJwtUser {
	_id: number;
	name: string;
}
