import config from '@config/configuration';
import { NextFunction } from 'express';
import { IpFilter } from 'express-ipfilter';

// const ips = [config.ip.guest];

export const ipFilter = (ips: string[]) => {
	let ipFilter;
	if (config.env === 'development') {
		ips.push("*.*.*.*");
		ipFilter = IpFilter(ips, { mode: 'allow' });
	} else if (config.env === 'test') {
		ips.push(config.ip.developer01);
		ipFilter = IpFilter(ips, { mode: 'allow' });
	} else if (config.env === 'production') {
		ipFilter = IpFilter(ips, { mode: 'allow' });
	}
	return ipFilter;
};
