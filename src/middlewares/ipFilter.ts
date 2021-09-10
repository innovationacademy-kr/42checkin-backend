import config from '@config/configuration';
import logger from '@lib/logger';
import { NextFunction, Request, Response } from 'express';

export const ipFilter = (ips: string[]) => async (req: Request, res: Response, next: NextFunction) => {
	const { clientIp } = req;
	if (config.env === 'development') {
		ips.push("*.*.*.*");
	} else if (config.env === 'test') {
		ips.push(config.ip.developer01);
	} else if (config.env === 'production') {
		ips.push(config.ip.developer01);
	}

	console.log({clientIp});
	if (!ips.includes(clientIp)) {
		logger.info({ clientIp });
		res.status(401).json({
			message: '42seoul Guest WiFi를 사용해주세요.'
		});
	}

	next();
};
