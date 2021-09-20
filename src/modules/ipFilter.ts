import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from '@modules/logger';
import env from '@modules/env';
import ApiError from '@modules/api.error';
import { catchAsync } from '@modules/error';

const ipFilter = (rules: Function[]) => async (req: Request, res: Response, next: NextFunction) => {
	const { clientIp } = req;

	if (rules.length === 0 || rules.some((rule) => rule(clientIp))) {
		next();
	} else {
        logger.info({
            type: 'get',
            message: 'unauthorized ip',
            data: { clientIp },
        });
		throw new ApiError(httpStatus.UNAUTHORIZED, '42seoul Guest WiFi를 사용해주세요.');
	}
};

const checkIsAdmin = (ip: string) => {
	const ips = [ env.ip.developer01, env.ip.developer02 ];
	return ips.includes(ip);
};

const isGuestWiFi = (ip: string) => {
	const ips = [ env.ip.guest ];
	return ips.includes(ip);
};

export const GuestWiFiIpFilter = catchAsync((req: Request, res: Response, next: NextFunction) => {
	const rules: Function[] = [];
	if (env.node_env === 'production') {
		rules.push(checkIsAdmin, isGuestWiFi);
	}
	return ipFilter(rules)(req, res, next);
});
