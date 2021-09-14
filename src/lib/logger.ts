import config from '@config/configuration';
import { dailyfile } from 'tracer';
import rTracer from 'cls-rtracer';
const rootFolder = './logs';
const logFormat = '{{timestamp}} <{{title}}> ({{file}}:{{line}}) {{message}}';
const logDateformat = 'yyyy-mm-dd HH:MM:ss';
/**
 * root: 파일위치
 * allLogsFileName: 로그 파일명
 * stackIndex: 로거를 사용하는곳을 알아내기 위해사용한다. 기본값 0을 사용하면 logger.ts가 찍힌다.
 * 1을 사용하면 한단계 위의 콜스택인 logger.ts를 사용하는 곳의 파일이 찍힌다.
 * format: 현재 로그 파일의 형식을 커스텀하게 지정한다.
 * preprocess: 로그 오브젝트를 불러와서 커스텀할 필터를 적용한다.
 * */

const logger_info = dailyfile({
	root: rootFolder,
	allLogsFileName: 'info',
	stackIndex: 1,
	level: 'info',
	format: logFormat,
	dateformat: logDateformat,
});

const logger_error = dailyfile({
	root: rootFolder,
	allLogsFileName: 'error',
	stackIndex: 2,
	level: 'error',
	format: logFormat,
	dateformat: logDateformat,
});

const logger_fatal = dailyfile({
	root: rootFolder,
	allLogsFileName: 'fatal',
	stackIndex: 2,
	level: 'fatal',
	format: logFormat,
	dateformat: logDateformat,
});

const logger_debug = dailyfile({
	root: rootFolder,
	allLogsFileName: 'debug',
	stackIndex: 1,
	level: config.log.debug ? 'debug' : 'info',
	format: logFormat,
	dateformat: logDateformat,
});

const logger = {
	error (...trace: any[]) {
		return logger_error.error(rTracer.id(), trace);
	},
	fatal (...trace: any[]) {
		return logger_fatal.fatal(rTracer.id(), trace);
	},
	debug (...trace: any[]) {
		return logger_debug.debug(rTracer.id(), trace);
	},
	info (...trace: any[]) {
		return logger_info.info(rTracer.id(), trace);
	}
};

export default logger;