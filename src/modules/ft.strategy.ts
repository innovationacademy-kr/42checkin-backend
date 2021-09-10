import env from '@modules/env';
import ApiError from './api.error';
import httpStatus from 'http-status';
import passport from 'passport';
import logger from '../modules/logger';
import { Users } from '../models';

let FortyTwoStrategy = require('passport-42').Strategy;

const validate = (token: string, rt: string, profile: any) => {
	try {
        // {userId: profile.id, userName: profile.username, email: profile.emails[0].value }
        console.log(profile);
		const user = new Users();
		logger.info(`oauth validation info`, { profile });
		if (profile._json.cursus_users.length < 2) {
			throw new ApiError(httpStatus.NOT_ACCEPTABLE, '접근할 수 없는 유저입니다.');
		} else {
			return user;
		}
	} catch (e) {
		logger.info(e);
		return false;
	}
};

const strategeyCallback = (
	accessToken: any,
	refreshToken: any,
	profile: { id: any },
	callback: (arg0: any, arg1: any) => any
) => {
	const user = validate(accessToken, refreshToken, profile);
	if (user) {
		callback(null, { ft: user });
	} else {
		callback(null, null);
	}
};

const Strategy42 = () =>
	new FortyTwoStrategy(
		{
			clientID: env.client.id,
			clientSecret: env.client.secret,
			callbackURL: env.client.callback,
			profileFields: {
				id: (obj: any) => String(obj.id),
				username: 'login',
				displayName: 'displayname',
				'name.familyName': 'last_name',
				'name.givenName': 'first_name',
				profileUrl: 'url',
				'emails.0.value': 'email',
				'phoneNumbers.0.value': 'phone',
				'photos.0.value': 'image_url'
			}
		},
		strategeyCallback
	);

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

export default Strategy42;
