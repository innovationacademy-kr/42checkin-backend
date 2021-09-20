import env from '@modules/env';
import { dailyfile } from 'tracer';
import { Model } from 'sequelize'
import rTracer from 'cls-rtracer';
const rootFolder = './logs';
const logFormat = '{{timestamp}} <{{title}}> ({{file}}:{{line}}) {{message}}';
const dbLogFormat = '{{timestamp}} {{message}}';
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

const logger_sql = dailyfile({
	root: rootFolder,
	allLogsFileName: 'sql',
	stackIndex: 1,
	level: 'info',
	format: dbLogFormat,
	dateformat: logDateformat,
});

const logger_error = dailyfile({
	root: rootFolder,
	allLogsFileName: 'error',
	stackIndex: 1,
	level: 'error',
	format: logFormat,
	dateformat: logDateformat,
});

const logger_fatal = dailyfile({
	root: rootFolder,
	allLogsFileName: 'fatal',
	stackIndex: 1,
	level: 'fatal',
	format: logFormat,
	dateformat: logDateformat,
});

const logger_debug = dailyfile({
	root: rootFolder,
	allLogsFileName: 'debug',
	stackIndex: 1,
	level: env.log.debug ? 'debug' : 'info',
	format: logFormat,
	dateformat: logDateformat,
});

const logger = {
	/** 보통 에러객체를 throw할 경우 로그를 남기기 위함 */
	error(...trace: any[]) {
		logger_info.info(rTracer.id(), trace);
		return logger_error.error(rTracer.id(), trace);
	},

	/** 치명적인 에러인 경우 로그를 남기기 위함 */
	fatal(...trace: any[]) {
		logger_info.info(rTracer.id(), trace);
		return logger_fatal.fatal(rTracer.id(), trace);
	},

	/** 로컬에서 개발시 확인용 */
	debug(...trace: any[]) {
		return logger_debug.debug(rTracer.id(), trace);
	},

	/** App의 전반적인 액션들을 확인하기 위함 (에러도 포함) */
	info(...trace: any[]) {
		return logger_info.info(rTracer.id(), ...trace);
	},

	/** ORM으로 인해 실행되는 쿼리 기록 */
	sql(...trace: any[]) {
		return logger_sql.info(rTracer.id(), trace);
	},

	/** response 기록 */
	logginResponse(response: any) {
		if (response?.body?.dataValues) {
			response.body = response?.body?.dataValues;
		}
		return logger_info.info(rTracer.id(), { response });
	}
};

export default logger;