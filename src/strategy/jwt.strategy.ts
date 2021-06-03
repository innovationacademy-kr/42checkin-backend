import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { Request } from 'express';
import config from "@config/configuration";

const opts: StrategyOptions = {
	jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
			return req.cookies.w_auth;
        },
	]),
	ignoreExpiration: false,
	secretOrKey: config.jwt.secret,
};

const validate = (payload: any) => {
    return { _id: payload.sub, name: payload.username };
}

const strategeyCallback = (jwt_payload: {sub: any, username: any}, done: any) => {
	const user = validate(jwt_payload);
	if (user._id) {
		return done(null, user);
	} else {
		return done(null, null);
	}
}

export const JwtStrategy = () => new Strategy(opts, strategeyCallback)
