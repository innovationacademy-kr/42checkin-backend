import config from '@config/configuration';
import { dailyfile } from 'tracer';

export class MyLogger {

	constructor() {
	}

	logger_info = dailyfile({
		root: './logs',
		allLogsFileName: 'info.42CheckIn',
		stackIndex: 1
	});

	logger_log = dailyfile({
		root: './logs',
		allLogsFileName: 'log.42CheckIn',
		stackIndex: 1,
		level: 'trace'
	});

	logger_error = dailyfile({
		root: './logs',
		allLogsFileName: 'error.42CheckIn',
		stackIndex: 1
	});

	logger_debug = dailyfile({
		root: './logs',
		allLogsFileName: 'debug.42CheckIn',
		stackIndex: 1,
		level: config.log.debug === true ? 'debug' : 'error'
	});

	log(...trace: any[]) {
		this.logger_log.trace(trace);
	}
	error(...trace: any[]) {
		this.logger_error.error(trace);
	}
	warn(...trace: any[]) {
		this.logger_log.warn(trace);
	}
	debug(...trace: any[]) {
		this.logger_debug.debug(trace);
	}
	info(...trace: any[]) {
		this.logger_info.info(trace);
	}
}
