import config from '@config/configuration';
import logger from '@lib/logger';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../lib/errorHandle';
import { catchAsync } from './error';

const ipFilter = (rules: Function[]) => async (req: Request, res: Response, next: NextFunction) => {
	const { clientIp } = req;
	if (rules.some((rule) => rule(clientIp))) {
		next();
	} else {
		logger.info({ clientIp });
		throw new ApiError(httpStatus.UNAUTHORIZED, '42seoul Guest WiFi를 사용해주세요.');
	}
};

const checkIsAdmin = (ip: string) => {
	const ips = [ config.ip.developer01, config.ip.developer02 ];
	return ips.includes(ip);
};

const isGuestWiFi = (ip: string) => {
	const ips = [ config.ip.guest ];
	return ips.includes(ip);
};

export const GuestWiFiIpFilter = catchAsync((req: Request, res: Response, next: NextFunction) => {
	const rules: Function[] = [];
	if (config.env === 'production') {
		rules.push(checkIsAdmin, isGuestWiFi);
	}
	return ipFilter(rules)(req, res, next);
});
