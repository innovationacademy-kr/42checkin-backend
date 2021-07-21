import config from '@config/configuration';
import { dailyfile } from 'tracer';
const root = './logs';

const logger_info = dailyfile({
	root,
	allLogsFileName: 'info',
	stackIndex: 1
});
const logger_log = dailyfile({
	root,
	allLogsFileName: 'log',
	stackIndex: 1,
	level: 'trace'
});
const logger_error = dailyfile({
	root,
	allLogsFileName: 'error',
	stackIndex: 1
});
const logger_debug = dailyfile({
	root,
	allLogsFileName: 'debug',
	stackIndex: 1,
	level: config.log.debug === true ? 'debug' : 'error'
});

const MyLogger = {
	log: (...trace: any[]) => {
		logger_log.trace(trace);
	},
	error: (...trace: any[]) => {
		logger_error.error(trace);
	},
	warn: (...trace: any[]) => {
		logger_log.warn(trace);
	},
	debug: (...trace: any[]) => {
		console.log(trace);
		logger_debug.debug(trace);
	},
	info: (...trace: any[]) => {
		logger_info.info(trace);
	}
};

export default MyLogger;
