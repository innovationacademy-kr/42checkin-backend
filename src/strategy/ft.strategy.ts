import config from '@config/configuration';
import User from '@entities/user.entity';
import passport from 'passport';
import { MyLogger } from '../service/logger.service';
var FortyTwoStrategy = require('passport-42').Strategy;

const validate = (token: string, rt: string, profile: any) => {
	const logger = new MyLogger();
	try {
		logger.debug('oauth validation start');
		const user = new User(profile.id, profile.username, profile.emails[0].value);
		logger.debug('authroized info : ', profile.id, profile.username);
		if (profile._json.cursus_users.length < 2) {
			// throw new NotAcceptableException();
			throw new Error('NotAcceptableException');
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
		callback(null, user);
	} else {
		callback(null, null);
	}
};

const Strategy42 = () =>
	new FortyTwoStrategy(
		{
			clientID: config.client.id,
			clientSecret: config.client.secret,
			callbackURL: config.client.callback,
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
