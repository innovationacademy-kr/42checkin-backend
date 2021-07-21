import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { Request } from 'express';
import config from '@config/configuration';
import { MyLogger } from '../service/logger.service';

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
	const logger = new MyLogger();
	logger.debug('jwt extracting...');
	logger.debug('jwt extracted data : ', payload.sub, payload.username);
	return { _id: payload.sub, name: payload.username };
};

const strategeyCallback = (jwt_payload: { sub: any; username: any }, done: any) => {
	const user = validate(jwt_payload);
	if (user._id) {
		return done(null, user);
	} else {
		return done(null, null);
	}
};

export const JwtStrategy = () => new Strategy(opts, strategeyCallback);
