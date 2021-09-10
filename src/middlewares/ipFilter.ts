import config from '@config/configuration';
import logger from '@lib/logger';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../lib/errorHandle';

const ipFilter = (rules: Function[]) => async (req: Request, res: Response, next: NextFunction) => {
	const { clientIp } = req;

	if (!rules.every(rule => rule())) {
		logger.info({ clientIp });
		throw new ApiError(httpStatus.UNAUTHORIZED,  '42seoul Guest WiFi를 사용해주세요.')
	}

	next();
};

const checkIsAdmin = (ip: string) => {
	const ips = [config.ip.developer01]
	return ips.includes(ip)
}

/** 로드밸런서 IP 범위 */
const isGuestWiFi = (ip: string) => {
	const ips = [config.ip.guest]
	return ips.includes(ip)
}

export const GuestWiFiIpFilter = () => {
	const rules: Function[] = [checkIsAdmin, isGuestWiFi];
	return ipFilter(rules);
}