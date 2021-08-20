import config from '@config/configuration';
import User from '@entities/user.entity';

import jwt from 'jsonwebtoken';
import * as userService from './user.service';
import httpStatus from 'http-status';
import ApiError from '@lib/errorHandle';

export const getAuth = async (user: User) => {
	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저정보가 존재하지 않습니다.');
	}
	const token = await userService.login(user);
	const decoded = jwt.decode(token) as any;
	const cookieOption: { domain?: string; expires: any } = {
		expires: new Date(decoded.exp * 1000)
	};
	const url_info = new URL(config.url.client);
	cookieOption.domain = url_info.hostname;
	return {
		token, cookieOption
	}
}
