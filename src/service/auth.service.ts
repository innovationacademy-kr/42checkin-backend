import config from '@config/configuration';

import jwt from 'jsonwebtoken';
import * as userService from './user.service';
import httpStatus from 'http-status';
import ApiError from '@lib/errorHandle';
import { UserModel } from '../model/user';

export const getAuth = async (user: UserModel) => {
	if (!user) {
		throw new ApiError(httpStatus.UNAUTHORIZED, '유저정보가 존재하지 않습니다.', { isFatal: true });
	}
	const token = await userService.login(user);
	const decoded = jwt.decode(token) as any;
	const cookieOption: { domain?: string; expires: any } = {
		expires: new Date(decoded.exp * 1000)
	};
	const url_info = new URL(config.url.client);
	if (config.env === 'production') {
		cookieOption.domain = config.url.root_host;
	} else {
		cookieOption.domain = url_info.hostname;
	}
	return {
		token, cookieOption
	}
}
