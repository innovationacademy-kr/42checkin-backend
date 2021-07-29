import config from '@config/configuration';
import User from '@entities/user.entity';

import jwt from 'jsonwebtoken';
import logger from '../lib/logger';

const generateToken = async (user: User): Promise<string> => {
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

export default {
	generateToken
}